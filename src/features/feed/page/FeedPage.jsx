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
import useBackToTop from '../hooks/useBackToTop';
import UnderlineTab from '../../../components/styled/UnderlineTab';
import BackToTopButton from '../../../components/styled/BackToTopButton';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = Object.prototype.hasOwnProperty.call(fetcherByTab, tabParam) ? tabParam : 'following';
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
  const needLogin = tab === 'following' && !isLoggedIn;

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

  const myId = user?.userId;
  const viewFeeds = list.items.map((item) => ({
    ...item,
    following: isFollowing(item),
    followDisabled: follow.followStatus === 'loading',
    isMine: myId != null && item.authorId === myId,
  }));

  const showBackToTop = useBackToTop();

  return (
    <>
      <TopBar title="피드" />
      <Wrapper>
        <UnderlineTab tabs={feedTabs} selected={tab} changeHandler={setTab} label="피드 종류" />
        <TrendingSection recipes={trending.trending} status={trending.status} />
        <FeedSection tab={tab} needLogin={needLogin} list={list} feeds={viewFeeds} {...actions} />
      </Wrapper>
      {showBackToTop && <BackToTopButton />}
    </>
  );
};

export default FeedPage;
