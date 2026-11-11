import styled from 'styled-components';
import FeedItem from '../item/FeedItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 피드 목록 — 게시글 카드 반복
const FeedList = ({ feeds, likeHandler, bookmarkHandler, followHandler }) => (
  <Wrapper>
    {feeds.map((item) => (
      <FeedItem
        key={item.id}
        data={item}
        likeHandler={likeHandler}
        bookmarkHandler={bookmarkHandler}
        followHandler={followHandler}
      />
    ))}
  </Wrapper>
);

export default FeedList;
