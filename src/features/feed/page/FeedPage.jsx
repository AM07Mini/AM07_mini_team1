import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Text from '../../../components/styled/Text';
import { colors, PAGE_PADDING, radius } from '../../../components/styled/theme';
import { getFollowingFeed, getLatestFeed, getPopularFeed, getTrendingRecipes } from '../../../api/feedApi';
import { feedTabs } from '../feedData';
import { toFeedCard, toTrendingCard } from '../feedMapper';
import FeedTab from '../item/FeedTab';
import FeedList from '../list/FeedList';
import TrendingList from '../list/TrendingList';

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

// TODO(01 로그인 담당과 합의): 토큰 저장 위치·키 이름
const ACCESS_TOKEN_KEY = 'accessToken';
const hasToken = () => {
  try {
    return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
  } catch {
    return false;
  }
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0); // "다시 시도" 누르면 +1

  const [trending, setTrending] = useState([]);
  const [trendingStatus, setTrendingStatus] = useState('loading');

  const isLoggedIn = hasToken();
  const needLogin = tab === 'following' && !isLoggedIn;

  // 탭을 빠르게 바꿨을 때 이전 탭 응답이 덮어쓰지 않게 — 요청마다 번호를 매기고 최신 번호만 반영
  const requestIdRef = useRef(0);
  const sentinelRef = useRef(null);

  // 유행 레시피: 처음 한 번만
  useEffect(() => {
    let ignore = false;
    getTrendingRecipes()
      .then((result) => {
        if (ignore) return;
        setTrending(result.content.map(toTrendingCard));
        setTrendingStatus('done');
      })
      .catch(() => {
        if (!ignore) setTrendingStatus('error');
      });
    return () => {
      ignore = true;
    };
  }, []);

  // 탭이 바뀌면 첫 페이지부터 다시 불러옴
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setFeeds([]);
    setPage(0);
    setHasNext(false);
    setError('');
    setLoadingMore(false);

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
    if (!hasNext || loadingMore || status !== 'done') return;
    const requestId = requestIdRef.current;
    const next = page + 1;
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
        // 다음 페이지 실패 시 지금 목록은 유지하고 더 불러오기만 멈춤 (스크롤하면 다시 시도)
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoadingMore(false);
      });
  }, [tab, page, hasNext, loadingMore, status]);

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

  // id가 같은 게시글 하나만 바꿔서 새 배열로 저장
  // TODO(Phase 2): 로그인 연동 후 좋아요·북마크·팔로우 API 호출 (지금은 화면에서만 바뀜)
  const updateFeed = (id, change) =>
    setFeeds((prev) => prev.map((item) => (item.id === id ? { ...item, ...change(item) } : item)));

  const likeHandler = (id) =>
    updateFeed(id, (item) => ({ liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) }));
  const bookmarkHandler = (id) => updateFeed(id, (item) => ({ bookmarked: !item.bookmarked }));
  const followHandler = (id) => updateFeed(id, (item) => ({ following: !item.following }));

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
          feeds={feeds}
          likeHandler={likeHandler}
          bookmarkHandler={bookmarkHandler}
          followHandler={followHandler}
        />
        {hasNext && <Sentinel ref={sentinelRef} />}
        {loadingMore && (
          <Notice $small role="status">
            <p>더 불러오는 중…</p>
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
            <MoreLink to="/search">더보기</MoreLink>
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
