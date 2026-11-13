import HashtagItem from '../item/HashtagItem';

// 해시태그 목록
const HashtagList = ({ hashtags }) => (
  <div>
    {hashtags.map((item) => (
      <HashtagItem key={item.id} data={item} />
    ))}
  </div>
);

export default HashtagList;
