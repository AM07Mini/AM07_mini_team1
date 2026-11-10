import RecipeCommentItem from '../item/RecipeCommentItem';

// 후기(댓글) 목록
const RecipeCommentList = ({ comments }) => (
  <div>
    {comments.map((item) => (
      <RecipeCommentItem key={item.id} data={item} />
    ))}
  </div>
);

export default RecipeCommentList;
