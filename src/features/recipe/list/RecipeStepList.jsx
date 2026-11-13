import RecipeStepItem from '../item/RecipeStepItem';

// 조리 단계 목록 — 기본 3단계, + 버튼으로 추가
const RecipeStepList = ({ steps }) => (
  <div>
    {steps.map((item) => (
      <RecipeStepItem key={item.id} data={item} />
    ))}
  </div>
);

export default RecipeStepList;
