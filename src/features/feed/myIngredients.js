// "내 재료"로 만들 수 있는지 계산하는 함수 모음 (유행 레시피 전체 보기에서 사용)

// 내 냉장고 재료를 저장·조회하는 api x
// console에 직접 넣어서 테스트진행
//  - API가 생기면 이 함수만 바꾸면 됨
const MY_INGREDIENTS_KEY = 'recipely.myIngredients';

export const getMyIngredientNames = () => {
  try {
    const names = JSON.parse(sessionStorage.getItem(MY_INGREDIENTS_KEY) || '[]');
    return Array.isArray(names) ? names.filter((name) => typeof name === 'string') : [];
  } catch {
    return [];
  }
};

// 비교할 때 공백 차이는 무시 ("대파 " 와 "대파" 를 같게)
const normalize = (name) => name.replace(/\s/g, '');

// 레시피 재료 이름 중 내 재료에 없는 개수
export const countMissing = (recipeIngredientNames, myIngredientNames) => {
  const mine = new Set(myIngredientNames.map(normalize));
  return recipeIngredientNames.filter((name) => !mine.has(normalize(name))).length;
};
