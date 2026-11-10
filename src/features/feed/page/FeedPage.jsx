import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Text from '../../../components/styled/Text';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
import { feedTabs, initialFeeds, trendingRecipes } from '../feedData';
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

const Empty = styled.p`
  margin: 0;
  padding: 40px 0;
  text-align: center;
  font-size: 12px;
  color: ${colors.grey1};
`;

// 탭마다 아래 목록 제목
const listTitle = {
  following: '팔로잉 유저의 새 레시피',
  popular: '좋아요가 많은 레시피',
  latest: '방금 올라온 레시피',
};

// 04 피드 — 팔로잉 / 인기 / 최신 탭, 팔로잉 유저 레시피·유행 레시피
const FeedPage = () => {
  const [tab, setTab] = useState('following');
  const [feeds, setFeeds] = useState(initialFeeds);

  // 탭에 따라 보여줄 게시글 — 팔로잉: 팔로우한 유저만 / 인기: 좋아요순 / 최신: 최근순
  let visibleFeeds = feeds;
  if (tab === 'following') visibleFeeds = feeds.filter((item) => item.following);
  if (tab === 'popular') visibleFeeds = [...feeds].sort((a, b) => b.likes - a.likes);
  if (tab === 'latest') visibleFeeds = [...feeds].sort((a, b) => a.minutesAgo - b.minutesAgo);

  // id가 같은 게시글 하나만 바꿔서 새 배열로 저장
  const updateFeed = (id, change) =>
    setFeeds((prev) => prev.map((item) => (item.id === id ? { ...item, ...change(item) } : item)));

  const likeHandler = (id) =>
    updateFeed(id, (item) => ({ liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) }));
  const bookmarkHandler = (id) => updateFeed(id, (item) => ({ bookmarked: !item.bookmarked }));
  const followHandler = (id) => updateFeed(id, (item) => ({ following: !item.following }));

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
              <Text variant="caption" color={colors.grey1}>
                이번 주 좋아요가 가장 많이 늘었어요
              </Text>
            </div>
            <MoreLink to="/search">더보기</MoreLink>
          </Row>
          <TrendingList recipes={trendingRecipes} />
        </Section>

        <Row>
          <Text as="h3" variant="sectionTitle">
            {listTitle[tab]}
          </Text>
          <MoreLink to="/mypage">북마크한 레시피</MoreLink>
        </Row>

        {visibleFeeds.length === 0 ? (
          <Empty>아직 팔로잉한 유저의 레시피가 없어요.</Empty>
        ) : (
          <FeedList
            feeds={visibleFeeds}
            likeHandler={likeHandler}
            bookmarkHandler={bookmarkHandler}
            followHandler={followHandler}
          />
        )}
      </Wrapper>
    </>
  );
};

export default FeedPage;
