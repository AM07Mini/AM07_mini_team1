// "내 재료"로 만들 수 있는지 계산 (유행 레시피 전체 보기에서 사용)
// 내 재료 목록은 hooks/useMyIngredients.js 에서 불러옴

// 비교할 때 공백 차이는 무시 ("대파 " 와 "대파" 를 같게)
const normalize = (name) => name.replace(/\s/g, '');

// 레시피 재료 이름 중 내 재료에 없는 개수
export const countMissing = (recipeIngredientNames, myIngredientNames) => {
  const mine = new Set(myIngredientNames.map(normalize));
  return recipeIngredientNames.filter((name) => !mine.has(normalize(name))).length;
};
