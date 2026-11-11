import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Text from '../../../components/styled/Text';
import { colors, PAGE_PADDING, radius } from '../../../components/styled/theme';
import {
  getFollowingFeed,
  getLatestFeed,
  getMyFollowingIds,
  getPopularFeed,
  getTrendingRecipes,
  setBookmark,
  setFollow,
  setLike,
} from '../../../api/feedApi';
import { feedTabs } from '../feedData';
import { toFeedCard, toTrendingCard } from '../feedMapper';
import FeedTab from '../item/FeedTab';
import FeedList from '../list/FeedList';
import TrendingList from '../list/TrendingList';
import { useAuth } from '../../../utils/context/AuthContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 14px ${PAGE_PADDING}px 28px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MoreLink = styled(Link)`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.secondary};
  text-decoration: none;
`;

// 로딩 / 에러 / 빈 화면 안내
const Notice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: ${(props) => (props.$small ? '16px 0' : '40px 0')};
  text-align: center;
  font-size: 12px;
  color: ${colors.grey1};

  p {
    margin: 0;
  }
`;

const NoticeAction = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: ${radius.button}px;
  background-color: ${colors.primary};
  color: ${colors.white};
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
`;

// 무한 스크롤 감지용 (화면에 보이면 다음 페이지 요청)
const Sentinel = styled.div`
  height: 1px;
`;

// 탭마다 아래 목록 제목
const listTitle = {
  following: '팔로잉 유저의 새 레시피',
  popular: '좋아요가 많은 레시피',
  latest: '방금 올라온 레시피',
};

// 탭마다 빈 화면 문구
const emptyText = {
  following: '아직 팔로잉한 유저의 레시피가 없어요.',
  popular: '아직 좋아요를 받은 레시피가 없어요.',
  latest: '아직 올라온 레시피가 없어요.',
};

const fetcherByTab = {
  following: getFollowingFeed,
  popular: getPopularFeed,
  latest: getLatestFeed,
};

const errorMessage = (err) => {
  if (err.response?.status === 401) return '로그인이 필요해요.';
  return err.response?.data?.message ?? '피드를 불러오지 못했어요.';
};

// 04 피드 — 팔로잉 / 인기 / 최신 탭, 유행 레시피 + 탭별 레시피 목록
const FeedPage = () => {
  const [tab, setTab] = useState('following');
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [status, setStatus] = useState('loading'); // loading | error | done
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false); // 화면 표시용 ("더 불러오는 중…")
  const [loadMoreFailed, setLoadMoreFailed] = useState(false); // 다음 페이지 실패 → 자동 로딩 멈춤
  const [reloadKey, setReloadKey] = useState(0); // "다시 시도" 누르면 +1

  const [trending, setTrending] = useState([]);
  const [trendingStatus, setTrendingStatus] = useState('loading');

  // 로그인 상태는 AuthContext 에서 (토큰은 axios 인터셉터가 요청에 자동으로 붙임)
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  // 내가 팔로우하는 사람 id (서버 기준) / 이 화면에서 팔로우·언팔로우한 결과 (authorId → true/false)
  const [followingIds, setFollowingIds] = useState(() => new Set());
  const [followOverrides, setFollowOverrides] = useState(() => new Map());

  // 로그인 상태면 내 팔로잉 목록을 한 번 불러옴 (실패하면 팔로잉 탭 카드만 '팔로잉' 으로 보임)
  useEffect(() => {
    setFollowingIds(new Set());
    setFollowOverrides(new Map());
    if (!isLoggedIn) return undefined;
    let ignore = false;
    getMyFollowingIds()
      .then((ids) => {
        if (!ignore) setFollowingIds(ids);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [isLoggedIn]);
  const needLogin = tab === 'following' && !isLoggedIn;

  // 탭을 빠르게 바꿨을 때 이전 탭 응답이 덮어쓰지 않게 — 요청마다 번호를 매기고 최신 번호만 반영
  const requestIdRef = useRef(0);
  const sentinelRef = useRef(null);
  // 다음 페이지 요청 중인지 — state 대신 ref 로 둬서 바뀌어도 loadMore·observer 가 다시 만들어지지 않게 함
  const loadingMoreRef = useRef(false);

  // 유행 레시피 — 요청마다 번호를 매겨서 늦게 도착한 옛 응답이 최신 순위를 덮어쓰지 않게 함
  const trendingRequestRef = useRef(0);
  const trendingTimerRef = useRef(null);

  // silent: 이미 화면에 있는 목록은 그대로 두고 뒤에서 순위만 새로 받음 (실패해도 지금 목록 유지)
  const loadTrending = useCallback((silent = false) => {
    const requestId = ++trendingRequestRef.current;
    getTrendingRecipes()
      .then((result) => {
        if (requestId !== trendingRequestRef.current) return;
        setTrending(result.content.map(toTrendingCard));
        setTrendingStatus('done');
      })
      .catch(() => {
        if (!silent && requestId === trendingRequestRef.current) setTrendingStatus('error');
      });
  }, []);

  // 좋아요 저장이 끝나면 순위를 다시 받아옴 — 연달아 누르면 마지막 클릭 후 한 번만 요청
  const refreshTrendingSoon = useCallback(() => {
    clearTimeout(trendingTimerRef.current);
    trendingTimerRef.current = setTimeout(() => loadTrending(true), 300);
  }, [loadTrending]);

  // 처음 들어왔을 때 한 번 + 화면을 떠나면 예약된 재요청 취소 / 늦게 온 응답 무시
  useEffect(() => {
    loadTrending();
    return () => {
      clearTimeout(trendingTimerRef.current);
      trendingRequestRef.current += 1;
    };
  }, [loadTrending]);

  // 탭이 바뀌면 첫 페이지부터 다시 불러옴
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setFeeds([]);
    setPage(0);
    setHasNext(false);
    setError('');
    loadingMoreRef.current = false;
    setLoadingMore(false);
    setLoadMoreFailed(false);

    // 비로그인인데 팔로잉 탭이면 호출하지 않음 (401이 나니까)
    if (needLogin) {
      setStatus('done');
      return;
    }

    setStatus('loading');
    fetcherByTab[tab](0)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        setFeeds(result.content.map((item) => toFeedCard(item, { following: tab === 'following' })));
        setHasNext(result.page + 1 < result.totalPages);
        setStatus('done');
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(errorMessage(err));
        setStatus('error');
      });
  }, [tab, needLogin, reloadKey]);

  // 다음 페이지 (page 는 0부터)
  const loadMore = useCallback(() => {
    if (!hasNext || loadingMoreRef.current || loadMoreFailed || status !== 'done') return;
    const requestId = requestIdRef.current;
    const next = page + 1;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    fetcherByTab[tab](next)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        const cards = result.content.map((item) => toFeedCard(item, { following: tab === 'following' }));
        // 새 글이 올라오면 페이지 경계가 밀려 같은 글이 다시 올 수 있어서 id로 중복 제거
        setFeeds((prev) => {
          const seen = new Set(prev.map((item) => item.id));
          return [...prev, ...cards.filter((item) => !seen.has(item.id))];
        });
        setPage(next);
        setHasNext(next + 1 < result.totalPages);
      })
      .catch(() => {
        // 다음 페이지 실패 시 지금 목록은 유지하고 자동 로딩을 멈춤 → "다시 시도" 버튼으로만 재요청
        if (requestId === requestIdRef.current) setLoadMoreFailed(true);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        loadingMoreRef.current = false;
        setLoadingMore(false);
      });
  }, [tab, page, hasNext, loadMoreFailed, status]);

  // 무한 스크롤 — 목록 끝의 Sentinel 이 보이면 loadMore
  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasNext) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNext, loadMore]);

  // 조건에 맞는 게시글만 바꿔서 새 배열로 저장
  const updateFeeds = (match, change) =>
    setFeeds((prev) => prev.map((item) => (match(item) ? { ...item, ...change(item) } : item)));
  const updateFeed = (id, change) => updateFeeds((item) => item.id === id, change);

  // 좋아요·북마크·팔로우는 로그인 필요 → 비로그인이면 로그인 페이지로
  const requireLogin = () => {
    if (isLoggedIn) return true;
    navigate('/signin');
    return false;
  };

  // 요청 중인 버튼 — 같은 버튼을 연타해서 POST/DELETE 가 꼬이지 않게
  const pendingRef = useRef(new Set());

  // 낙관적 업데이트: 화면 먼저 바꾸고 API 호출 → 실패하면 되돌림
  const runToggle = async (key, apply, request) => {
    if (pendingRef.current.has(key)) return;
    pendingRef.current.add(key);
    apply(true);
    try {
      await request();
    } catch {
      apply(false);
      // TODO(디자인): 토스트로 "잠시 후 다시 시도해주세요" 안내
    } finally {
      pendingRef.current.delete(key);
    }
  };

  const likeHandler = (id) => {
    if (!requireLogin()) return;
    const item = feeds.find((feed) => feed.id === id);
    if (!item) return;
    const next = !item.liked; // 누른 순간의 값으로 고정
    runToggle(
      `like-${id}`,
      (forward) => {
        const liked = forward ? next : !next;
        const delta = liked ? 1 : -1;
        updateFeed(id, (cur) => (cur.liked === liked ? {} : { liked, likes: cur.likes + delta }));
        // 같은 레시피가 "지금 유행하는 레시피"에도 있으면 좋아요 수를 같이 맞춤
        setTrending((prev) =>
          prev.map((recipe) =>
            recipe.recipeId === id ? { ...recipe, likes: Math.max(0, recipe.likes + delta) } : recipe,
          ),
        );
      },
      // 저장 성공 후 유행 레시피 순위 갱신 (5위 밖이던 레시피가 새로 들어오거나 순서가 바뀔 수 있음)
      async () => {
        await setLike(id, next);
        refreshTrendingSoon();
      },
    );
  };

  const bookmarkHandler = (id) => {
    if (!requireLogin()) return;
    const item = feeds.find((feed) => feed.id === id);
    if (!item) return;
    const next = !item.bookmarked;
    runToggle(
      `bookmark-${id}`,
      (forward) => updateFeed(id, () => ({ bookmarked: forward ? next : !next })),
      () => setBookmark(id, next),
    );
  };

  // 팔로우 상태: 이 화면에서 누른 값(followOverrides) → 팔로잉 탭 카드 → 내 팔로잉 목록(followingIds) 순으로 판단
  // 글쓴이(authorId) 기준이라 같은 사람이 쓴 카드는 모두 같이 바뀌고, 다음 페이지 카드에도 그대로 적용됨
  const isFollowing = (item) =>
    followOverrides.has(item.authorId)
      ? followOverrides.get(item.authorId)
      : item.following || followingIds.has(item.authorId);

  const setFollowOverride = (authorId, following) =>
    setFollowOverrides((prev) => new Map(prev).set(authorId, following));

  const followHandler = (id) => {
    if (!requireLogin()) return;
    const item = feeds.find((feed) => feed.id === id);
    if (!item?.authorId) return;
    const { authorId } = item;
    const next = !isFollowing(item);
    runToggle(
      `follow-${authorId}`,
      (forward) => setFollowOverride(authorId, forward ? next : !next),
      () => setFollow(authorId, next),
    );
  };

  // 화면에 그릴 카드 — 팔로우 상태와 "내 글인지"를 붙임 (내 글이면 팔로우 버튼 숨김)
  const myId = user?.userId;
  const viewFeeds = feeds.map((item) => ({
    ...item,
    following: isFollowing(item),
    isMine: myId != null && item.authorId === myId,
  }));

  const renderFeeds = () => {
    if (needLogin) {
      return (
        <Notice>
          <p>로그인하면 팔로잉한 유저의 레시피를 볼 수 있어요.</p>
          <NoticeAction as={Link} to="/signin">
            로그인하기
          </NoticeAction>
        </Notice>
      );
    }
    if (status === 'loading') {
      return (
        <Notice role="status">
          <p>레시피를 불러오는 중이에요…</p>
        </Notice>
      );
    }
    if (status === 'error') {
      return (
        <Notice role="alert">
          <p>{error}</p>
          <NoticeAction type="button" onClick={() => setReloadKey((key) => key + 1)}>
            다시 시도
          </NoticeAction>
        </Notice>
      );
    }
    if (feeds.length === 0) {
      return (
        <Notice>
          <p>{emptyText[tab]}</p>
        </Notice>
      );
    }
    return (
      <>
        <FeedList
          feeds={viewFeeds}
          likeHandler={likeHandler}
          bookmarkHandler={bookmarkHandler}
          followHandler={followHandler}
        />
        {hasNext && !loadMoreFailed && <Sentinel ref={sentinelRef} />}
        {loadingMore && (
          <Notice $small role="status">
            <p>더 불러오는 중…</p>
          </Notice>
        )}
        {loadMoreFailed && (
          <Notice $small role="alert">
            <p>레시피를 더 불러오지 못했어요.</p>
            {/* 실패 상태를 풀면 Sentinel 이 다시 그려지고 observer 가 붙으면서 바로 다음 페이지를 요청함 */}
            <NoticeAction type="button" onClick={() => setLoadMoreFailed(false)}>
              다시 시도
            </NoticeAction>
          </Notice>
        )}
      </>
    );
  };

  const renderTrending = () => {
    if (trendingStatus === 'loading') {
      return (
        <Notice $small role="status">
          <p>불러오는 중…</p>
        </Notice>
      );
    }
    if (trendingStatus === 'error') {
      return (
        <Notice $small>
          <p>유행 레시피를 불러오지 못했어요.</p>
        </Notice>
      );
    }
    if (trending.length === 0) {
      return (
        <Notice $small>
          <p>아직 유행하는 레시피가 없어요.</p>
        </Notice>
      );
    }
    return <TrendingList recipes={trending} />;
  };

  return (
    <>
      <TopBar title="피드" />
      <Wrapper>
        <FeedTab tabs={feedTabs} selected={tab} changeHandler={setTab} />

        <Section>
          <Row>
            <div>
              <Text as="h3" variant="sectionTitle">
                지금 유행하는 레시피
              </Text>
              {/* TODO(디자인/백엔드): "이번 주" 기간 필터 API 없음 — 지금은 전체 좋아요순 */}
              <Text variant="caption" color={colors.grey1}>
                이번 주 좋아요가 가장 많이 늘었어요
              </Text>
            </div>
            <MoreLink to="/feed/trending">더보기</MoreLink>
          </Row>
          {renderTrending()}
        </Section>

        <Row>
          <Text as="h3" variant="sectionTitle">
            {listTitle[tab]}
          </Text>
          <MoreLink to="/mypage">북마크한 레시피</MoreLink>
        </Row>
        {renderFeeds()}
      </Wrapper>
    </>
  );
};

export default FeedPage;
