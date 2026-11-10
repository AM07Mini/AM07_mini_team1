// 레시피 카드 — 썸네일·이름·난이도·조리 시간, 누르면 상세로
const RecipeItem = ({ data }) => (
  <div>{data.name}</div>
);

export default RecipeItem;
