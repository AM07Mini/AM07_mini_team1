import RecipeItem from '../item/RecipeItem';

// 레시피 목록 — 썸네일 카드 반복
const RecipeList = ({ recipes }) => (
  <div>
    {recipes.map((item) => (
      <RecipeItem key={item.id} data={item} />
    ))}
  </div>
);

export default RecipeList;
