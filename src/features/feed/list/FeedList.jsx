import FeedItem from '../item/FeedItem';

// 피드 목록 — 게시글 카드 반복
const FeedList = ({ feeds }) => (
  <div>
    {feeds.map((item) => (
      <FeedItem key={item.id} data={item} />
    ))}
  </div>
);

export default FeedList;
