import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../api/axios';
import SearchInput from '../../../components/styled/SearchInput';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
import { isAuthError } from '../authError';
import { FOLLOW_PAGE_SIZE } from '../constants';
import FollowUserList from '../list/FollowUserList';
import MyPageTopBar from '../ui/MyPageTopBar';
import StatusMessage from '../ui/StatusMessage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px ${PAGE_PADDING}px 32px;
`;

const Tabs = styled.div`
  display: flex;
`;

// 밑줄 탭 — 선택: 진한 굵은 밑줄 / 나머지: 옅은 얇은 밑줄
const Tab = styled.button`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-bottom: ${(props) => (props.$selected ? `3px solid ${colors.primary}` : `1px solid ${colors.grey4}`)};
  background: none;
  font-family: inherit;
  font-size: 15px;
  font-weight: ${(props) => (props.$selected ? 700 : 400)};
  color: ${(props) => (props.$selected ? colors.primary : colors.grey1)};
  cursor: pointer;
`;

const emptyPage = { content: [], totalElements: 0 };

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
  const [pendingIds, setPendingIds] = useState([]); // 팔로우 요청 중인 사람 id

  useEffect(() => {
    loadData();
  }, []);

  // 내 닉네임 · 팔로워 · 팔로잉 불러오기 — 실제 데이터는 response.data.result
  const loadData = async () => {
    try {
      const config = { params: { page: 0, size: FOLLOW_PAGE_SIZE } };
      const [meResponse, followersResponse, followingResponse] = await Promise.all([
        api.get('/users/me'),
        api.get(tabInfo.followers.url, config),
        api.get(tabInfo.following.url, config),
      ]);
      setNickname(meResponse.data.result.nickname);
      setLists({ followers: followersResponse.data.result, following: followingResponse.data.result });
      setLoaded(true);
    } catch (e) {
      console.error(e);
      if (isAuthError(e)) {
        setError({ message: '로그인이 필요해요.', needLogin: true });
      } else {
        setError({ message: e.response?.data?.message ?? '목록을 불러오지 못했어요.' });
      }
    }
  };

  // 탭을 누르면 주소만 바꿈 (replace: 뒤로 가기 기록이 탭마다 쌓이지 않게)
  const tabChangeHandler = (value) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  // 같은 사람이 두 목록에 다 있을 수 있어서 양쪽 다 바꿈
  const setFollowed = (userId, followed) => {
    const update = (page) => ({
      ...page,
      content: page.content.map((user) => (user.id === userId ? { ...user, followedByMe: followed } : user)),
    });
    setLists((prev) => ({ followers: update(prev.followers), following: update(prev.following) }));
  };

  // 팔로잉 버튼 → 언팔로우 / 팔로우 버튼 → 팔로우
  // 목록에서 바로 빼지 않고 버튼만 바꿔서, 잘못 눌러도 다시 누르면 되돌릴 수 있게
  const followToggleHandler = async (user) => {
    if (pendingIds.includes(user.id)) return;
    setPendingIds((prev) => [...prev, user.id]);
    try {
      if (user.followedByMe) {
        await api.delete(`/follows/${user.id}`);
        setFollowed(user.id, false);
      } else {
        await api.post(`/follows/${user.id}`);
        setFollowed(user.id, true);
      }
    } catch (e) {
      console.error(e);
      window.alert(e.response?.data?.message ?? '팔로우 상태를 바꾸지 못했어요.');
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== user.id));
    }
  };

  // 닉네임 검색 — 불러온 목록 안에서 거름 (검색 API 없음)
  const trimmedKeyword = keyword.trim();
  const shownUsers = lists[tab].content.filter((user) => user.nickname.includes(trimmedKeyword));
  const emptyMessage = trimmedKeyword ? '검색 결과가 없어요.' : tabInfo[tab].empty;

  const renderContent = () => {
    if (error) return <StatusMessage message={error.message} needLogin={error.needLogin} />;
    if (!loaded) return <StatusMessage message="불러오는 중이에요…" />;

    return (
      <Wrapper>
        <Tabs>
          {Object.entries(tabInfo).map(([value, info]) => (
            <Tab key={value} type="button" $selected={tab === value} onClick={() => tabChangeHandler(value)}>
              {info.title} {lists[value].totalElements}
            </Tab>
          ))}
        </Tabs>

        <SearchInput
          value={keyword}
          changeHandler={(e) => setKeyword(e.target.value)}
          placeholder="닉네임으로 검색"
        />

        <FollowUserList
          users={shownUsers}
          emptyMessage={emptyMessage}
          pendingIds={pendingIds}
          toggleHandler={followToggleHandler}
        />
      </Wrapper>
    );
  };

  return (
    <>
      <MyPageTopBar title={nickname} showBack />
      {renderContent()}
    </>
  );
};

export default FollowListPage;
