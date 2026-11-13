import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import { PAGE_PADDING } from '../../../components/styled/theme';
import { getFollowingFeed, getLatestFeed, getPopularFeed } from '../../../api/feedApi';
import { useAuth } from '../../../utils/context/AuthContext';
import { feedTabs } from '../feedUtils';
import { toFeedCard } from '../feedMapper';
import useFeedActions from '../hooks/useFeedActions';
import useFollow from '../hooks/useFollow';
import usePagedList from '../hooks/usePagedList';
import useTrending from '../hooks/useTrending';
import UnderlineTab from '../../../components/styled/UnderlineTab';
import FeedSection from '../section/FeedSection';
import TrendingSection from '../section/TrendingSection';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 14px ${PAGE_PADDING}px 28px;
`;

const fetcherByTab = {
  following: getFollowingFeed,
  popular: getPopularFeed,
  latest: getLatestFeed,
};


const FeedPage = () => {
  // 탭을 URL 쿼리에 저장 → 다른 화면 갔다가 뒤로가기 해도 같은 탭 유지 (예: /feed?tab=popular)
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  // URL 값이 없거나 이상하면 기본값 'following'
  // hasOwnProperty: ?tab=toString 처럼 객체 기본 속성 이름이 들어와도 통과시키지 않음
  // (Object.hasOwn은 Safari 15.3 이하에서 없어서 이 방식 사용)
  const tab = Object.prototype.hasOwnProperty.call(fetcherByTab, tabParam) ? tabParam : 'following';
  // replace: true → 탭 바꿀 때마다 히스토리가 쌓이지 않게
  const setTab = (value) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', value);
        return next;
      },
      { replace: true },
    );
  const { isLoggedIn, user } = useAuth();
  // 비로그인인데 팔로잉 탭이면 호출하지 않음 (401)
  const needLogin = tab === 'following' && !isLoggedIn;

  // 탭이 바뀌면 함수가 바뀌어서 첫 페이지부터 다시 불러옴
  const fetchPage = useCallback(
    (page) =>
      fetcherByTab[tab](page).then((result) => ({
        ...result,
        content: result.content.map((item) => toFeedCard(item, { following: tab === 'following' })),
      })),
    [tab],
  );
  const list = usePagedList(fetchPage, { enabled: !needLogin });

  const trending = useTrending();
  const follow = useFollow(isLoggedIn);
  const { isFollowing } = follow;
  const actions = useFeedActions({
    feeds: list.items,
    setFeeds: list.setItems,
    setTrending: trending.setTrending,
    refreshTrendingSoon: trending.refreshTrendingSoon,
    follow,
  });

  // 화면에 그릴 카드 — 팔로우 상태와 "내 글인지"를 붙임 (내 글이면 팔로우 버튼 숨김)
  const myId = user?.userId;
  const viewFeeds = list.items.map((item) => ({
    ...item,
    following: isFollowing(item),
    followDisabled: follow.followStatus === 'loading',
    isMine: myId != null && item.authorId === myId,
  }));

  return (
    <>
      <TopBar title="피드" />
      <Wrapper>
        <UnderlineTab tabs={feedTabs} selected={tab} changeHandler={setTab} label="피드 종류" />
        <TrendingSection recipes={trending.trending} status={trending.status} />
        <FeedSection tab={tab} needLogin={needLogin} list={list} feeds={viewFeeds} {...actions} />
      </Wrapper>
    </>
  );
};

export default FeedPage;
