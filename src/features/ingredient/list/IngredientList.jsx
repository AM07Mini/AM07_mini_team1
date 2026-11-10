import IngredientItem from '../item/IngredientItem';

// 식재료 목록 — 선택 가능한 재료 칩들
const IngredientList = ({ ingredients }) => (
  <div>
    {ingredients.map((item) => (
      <IngredientItem key={item.id} data={item} />
    ))}
  </div>
);

export default IngredientList;
