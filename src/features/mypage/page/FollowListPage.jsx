import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../api/axios';
import { followUser, unfollowUser } from '../../../api/followApi';
import SearchInput from '../../../components/styled/SearchInput';
import UnderlineTab from '../../../components/styled/UnderlineTab';
import { PAGE_PADDING } from '../../../components/styled/theme';
import { isAuthError } from '../authError';
import { FOLLOW_PAGE_SIZE } from '../constants';
import FollowUserList from '../list/FollowUserList';
import TopBar from '../../../components/layout/TopBar';
import StatusMessage from '../../../components/styled/StatusMessage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px ${PAGE_PADDING}px 32px;
`;

const emptyPage = { content: [], totalElements: 0 };

// 검색창 입력이 멈추고 이만큼 지나면 서버에 검색 요청 (한 글자마다 요청하지 않게)
const SEARCH_DELAY_MS = 300;

// 탭 정보 — 주소 ?tab= 값, 제목, 목록 API, 비었을 때 문구
const tabInfo = {
  followers: { title: '팔로워', url: '/follows/followers', empty: '아직 나를 팔로우한 사람이 없어요.' },
  following: { title: '팔로잉', url: '/follows/following', empty: '아직 팔로우한 사람이 없어요.' },
};

// 팔로워 · 팔로잉 목록 — 마이 페이지에서 팔로워/팔로잉 수를 누르면 들어옴
// 주소로 첫 탭 지정: /mypage/follow?tab=following (없으면 팔로워)
const FollowListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'following' ? 'following' : 'followers';

  const [nickname, setNickname] = useState(''); // 상단 제목 (내 닉네임)
  const [lists, setLists] = useState({ followers: emptyPage, following: emptyPage });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null); // { message, needLogin }
  const [keyword, setKeyword] = useState('');
  // 서버 닉네임 검색 결과 — 어떤 탭 · 검색어의 결과인지 같이 기억 { tab, keyword, content, failed }
  const [searchResult, setSearchResult] = useState(null);
  const [pendingIds, setPendingIds] = useState([]); // 팔로우 요청 중인 사람 id

  useEffect(() => {
    // 화면을 떠나면 진행 중인 요청을 취소하고 페이지 이어 받기도 멈춤
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, []);

  // 목록 하나를 끝까지 불러오기 — keyword를 주면 서버에서 닉네임 부분 일치로 거른 목록
  const loadAllPages = async (url, signal, keyword) => {
    const content = [];
    let page = 0;
    let totalPages = 1;
    let totalElements = 0;
    while (page < totalPages) {
      // 취소되면 api.get이 에러를 내서 반복이 바로 멈춤
      const params = { page, size: FOLLOW_PAGE_SIZE, ...(keyword && { keyword }) };
      const response = await api.get(url, { params, signal });
      const result = response.data.result;
      content.push(...result.content);
      totalPages = result.totalPages;
      totalElements = result.totalElements;
      page += 1;
    }
    return { content, totalElements };
  };

  // 내 닉네임 · 팔로워 · 팔로잉 불러오기 — 실제 데이터는 response.data.result
  const loadData = async (signal) => {
    try {
      const [meResponse, followers, following] = await Promise.all([
        api.get('/users/me', { signal }),
        loadAllPages(tabInfo.followers.url, signal),
        loadAllPages(tabInfo.following.url, signal),
      ]);
      setNickname(meResponse.data.result.nickname);
      setLists({ followers, following });
      setLoaded(true);
    } catch (e) {
      // 화면을 떠나서 취소된 요청은 오류가 아님
      if (e.code === 'ERR_CANCELED') return;
      console.error(e);
      if (isAuthError(e)) {
        setError({ message: '로그인이 필요해요.', needLogin: true });
      } else {
        setError({ message: e.response?.data?.message ?? '목록을 불러오지 못했어요.' });
      }
    }
  };

  // 닉네임 검색 — 입력이 멈추면 지금 탭 목록을 서버에서 검색
  // 검색어나 탭이 바뀌면 진행 중인 요청은 취소 (늦게 온 옛 결과가 덮어쓰지 않게)
  const trimmedKeyword = keyword.trim();
  useEffect(() => {
    if (!trimmedKeyword) {
      setSearchResult(null);
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const { content } = await loadAllPages(tabInfo[tab].url, controller.signal, trimmedKeyword);
        setSearchResult({ tab, keyword: trimmedKeyword, content });
      } catch (e) {
        if (e.code === 'ERR_CANCELED') return;
        console.error(e);
        setSearchResult({ tab, keyword: trimmedKeyword, content: [], failed: true });
      }
    }, SEARCH_DELAY_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedKeyword, tab]);

  // 탭을 누르면 주소만 바꿈 (replace: 뒤로 가기 기록이 탭마다 쌓이지 않게)
  const tabChangeHandler = (value) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  // 같은 사람이 두 목록에 다 있을 수 있어서 양쪽 다 바꿈, 팔로잉 수도 ±1
  // 팔로우: 팔로잉 목록에 없던 사람이면 맨 위에 추가
  // 언팔로우: 목록에서 빼지 않고 버튼만 바꿈 (다시 눌러 되돌릴 수 있게)
  const setFollowed = (target, followed) => {
    const update = (page) => ({
      ...page,
      content: page.content.map((user) => (user.id === target.id ? { ...user, followedByMe: followed } : user)),
    });
    // 검색 결과에 있는 사람도 버튼 상태를 같이 바꿈
    setSearchResult((prev) => (prev ? update(prev) : prev));
    setLists((prev) => {
      const following = update(prev.following);
      const isNew = followed && !following.content.some((user) => user.id === target.id);
      return {
        followers: update(prev.followers),
        following: {
          content: isNew ? [{ ...target, followedByMe: true }, ...following.content] : following.content,
          totalElements: following.totalElements + (followed ? 1 : -1),
        },
      };
    });
  };

  // 팔로잉 버튼 → 언팔로우 / 팔로우 버튼 → 팔로우
  // 목록에서 바로 빼지 않고 버튼만 바꿔서, 잘못 눌러도 다시 누르면 되돌릴 수 있게
  const followToggleHandler = async (user) => {
    if (pendingIds.includes(user.id)) return;
    setPendingIds((prev) => [...prev, user.id]);
    try {
      if (user.followedByMe) {
        await unfollowUser(user.id);
        setFollowed(user, false);
      } else {
        await followUser(user.id);
        setFollowed(user, true);
      }
    } catch (e) {
      console.error(e);
      window.alert(e.response?.data?.message ?? '팔로우 상태를 바꾸지 못했어요.');
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== user.id));
    }
  };

  // 보여줄 목록 — 검색어가 없으면 전체, 있으면 지금 탭 · 검색어의 서버 결과
  const currentResult =
    searchResult && searchResult.tab === tab && searchResult.keyword === trimmedKeyword ? searchResult : null;
  // 팔로우 버튼 상태는 전체 목록(lists) 쪽이 최신 — 팔로우 요청 중에 시작된 검색의 응답이
  // 늦게 와서 옛 상태를 보여주지 않도록, 전체 목록에 있는 사람은 그쪽 followedByMe를 씀
  const withLatestFollow = (user) => {
    const latest = lists[tab].content.find((item) => item.id === user.id);
    return latest ? { ...user, followedByMe: latest.followedByMe } : user;
  };
  const shownUsers = trimmedKeyword ? (currentResult?.content ?? []).map(withLatestFollow) : lists[tab].content;

  const getEmptyMessage = () => {
    if (!trimmedKeyword) return tabInfo[tab].empty;
    if (!currentResult) return '검색 중이에요…';
    if (currentResult.failed) return '검색하지 못했어요. 잠시 후 다시 시도해주세요.';
    return '검색 결과가 없어요.';
  };

  const renderContent = () => {
    if (error) return <StatusMessage message={error.message} needLogin={error.needLogin} />;
    if (!loaded) return <StatusMessage message="불러오는 중이에요…" />;

    return (
      <Wrapper>
        <UnderlineTab
          tabs={Object.entries(tabInfo).map(([value, info]) => ({
            value,
            title: `${info.title} ${lists[value].totalElements}`,
          }))}
          selected={tab}
          changeHandler={tabChangeHandler}
          label="팔로워 · 팔로잉"
        />

        <SearchInput
          value={keyword}
          changeHandler={(e) => setKeyword(e.target.value)}
          placeholder="닉네임으로 검색"
        />

        <FollowUserList
          users={shownUsers}
          emptyMessage={getEmptyMessage()}
          pendingIds={pendingIds}
          toggleHandler={followToggleHandler}
        />
      </Wrapper>
    );
  };

  return (
    <>
      <TopBar title={nickname} showBack />
      {renderContent()}
    </>
  );
};

export default FollowListPage;
