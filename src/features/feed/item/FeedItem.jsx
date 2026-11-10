// 피드 카드 — 작성자(프로필·팔로우), 큰 사진, 좋아요·댓글 수, 북마크, 레시피 이름·해시태그
const FeedItem = ({ data }) => (
  <div>{data.name}</div>
);

export default FeedItem;
