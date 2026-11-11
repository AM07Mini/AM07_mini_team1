import api from '../../../api/axios';

const difficultyLabels = {
  EASY: '쉬움',
  MEDIUM: '보통',
  HARD: '어려움',
};

export const fetchSearchRecipes = async (keyword, signal) => {
  const { data } = await api.get('/recipes/search', {
    params: {
      scope: 'PUBLIC',
      page: 0,
      size: 20,
      ...(keyword.trim() ? { keyword: keyword.trim() } : {}),
    },
    signal,
  });

  if (!data?.isSuccess) {
    throw new Error(data?.message || '레시피 검색에 실패했습니다.');
  }

  const result = data.result;
  if (!Array.isArray(result?.content)) {
    throw new Error('레시피 검색 응답 형식이 올바르지 않습니다.');
  }
  if (!Number.isFinite(result.totalElements)) {
    throw new Error('레시피 검색 결과 개수가 응답에 없습니다.');
  }

  return {
    recipes: result.content.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.thumbnailUrl,
      description:
        recipe.description ||
        [
          difficultyLabels[recipe.difficulty],
          Number.isFinite(recipe.cookingMinutes) ? `${recipe.cookingMinutes}분` : null,
        ]
          .filter(Boolean)
          .join(' · ') ||
        '레시피 설명이 없습니다.',
    })),
    totalElements: result.totalElements,
  };
};
