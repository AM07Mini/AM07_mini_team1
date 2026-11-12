import api from '../../../api/axios';
import { formatDifficulty } from '../../../utils/difficulty';

const CATALOG_REQUEST_TIMEOUT_MS = 10_000;


const getResult = async (path, signal) => {
  const { data } = await api.get(path, {
    signal,
    timeout: CATALOG_REQUEST_TIMEOUT_MS,
  });
  if (!data?.isSuccess) {
    throw new Error(data?.message || '검색 필터를 불러오지 못했습니다.');
  }
  return data.result;
};

const makeFilter = (
  key,
  title,
  items,
  selectionMode = 'multiple',
  message = '',
  maxSelections,
) => ({
  key,
  title,
  selectionMode,
  items,
  message,
  maxSelections,
});

export const fetchSearchFilterCatalogs = async (isLoggedIn, signal) => {
  const [flavorsOutcome, foodTypesOutcome, categoriesOutcome] = await Promise.allSettled([
    getResult('/flavors/catalog', signal),
    getResult('/food-types', signal),
    isLoggedIn ? getResult('/categories', signal) : Promise.resolve(null),
  ]);

  if (signal.aborted) return [];

  const flavors =
    flavorsOutcome.status === 'fulfilled'
      ? flavorsOutcome.value?.defaults?.map(({ id, name }) => ({
          value: id,
          label: name === '고소맛' ? '고소한 맛' : name,
        })) || []
      : [];
  const foodTypes =
    foodTypesOutcome.status === 'fulfilled'
      ? foodTypesOutcome.value?.map(({ id, name }) => ({ value: id, label: name })) || []
      : [];
  const categoryResult =
    categoriesOutcome.status === 'fulfilled' ? categoriesOutcome.value : null;
  const isCategoryList =
    Array.isArray(categoryResult) ||
    (Array.isArray(categoryResult?.defaults) && Array.isArray(categoryResult?.mine));
  const categories = Array.isArray(categoryResult)
    ? categoryResult.map(({ id, name }) => ({ value: id, label: name }))
    : isCategoryList
      ? [...categoryResult.defaults, ...categoryResult.mine].map(({ id, name }) => ({
          value: id,
          label: name,
        }))
      : [];

  return [
    makeFilter(
      'flavorIds',
      '맛',
      flavors,
      'multiple',
      flavorsOutcome.status === 'rejected' ? '맛 필터를 불러오지 못했습니다.' : '',
      2,
    ),
    makeFilter(
      'foodTypeId',
      '음식 종류',
      foodTypes,
      'single',
      foodTypesOutcome.status === 'rejected' ? '음식 종류를 불러오지 못했습니다.' : '',
    ),
    makeFilter(
      'categoryIds',
      '카테고리',
      categories,
      'multiple',
      !isLoggedIn
        ? '카테고리 필터는 로그인 후 사용할 수 있습니다.'
        : categoriesOutcome.status === 'rejected'
          ? '카테고리를 불러오지 못했습니다.'
          : !isCategoryList
            ? '카테고리 API 응답 형식이 올바르지 않습니다.'
            : '',
    ),
  ];
};

export const fetchSearchRecipes = async (keyword, filters, signal, size = 20) => {
  const params = {
    scope: 'PUBLIC',
    page: 0,
    size,
  };
  const normalizedKeyword = keyword.trim();

  if (normalizedKeyword) params.keyword = normalizedKeyword;
  if (filters.flavorIds.length) params.flavorIds = filters.flavorIds;
  if (filters.foodTypeId.length) params.foodTypeId = filters.foodTypeId[0];
  if (filters.categoryIds.length) params.categoryIds = filters.categoryIds;
  if (filters.difficulty.length) params.difficulty = filters.difficulty[0];
  if (filters.maxCookingMinutes.length) {
    params.maxCookingMinutes = filters.maxCookingMinutes[0];
  }

  const { data } = await api.get('/recipes/search', {
    params,
    paramsSerializer: { indexes: null },
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
      meta:
        formatDifficulty(recipe.difficulty, recipe.cookingMinutes) ||
        '난이도 정보 없음',
    })),
    totalElements: result.totalElements,
  };
};

export const fetchRelaxedSearchSuggestions = async (keyword, selected, filters, signal) => {
  const candidates = filters.flatMap((filter) =>
    (selected[filter.key] || []).map((value) => ({
      key: filter.key,
      value,
      label: filter.items.find((item) => item.value === value)?.label ?? String(value),
    })),
  );
  const results = await Promise.allSettled(
    candidates.map(async (candidate) => {
      const relaxedFilters = {
        ...selected,
        [candidate.key]: selected[candidate.key].filter((value) => value !== candidate.value),
      };
      const result = await fetchSearchRecipes(keyword, relaxedFilters, signal, 1);
      return { ...candidate, totalElements: result.totalElements };
    }),
  );

  if (signal.aborted) return { suggestions: [], hasError: false };

  const suggestions = results
    .filter((result) => result.status === 'fulfilled' && result.value.totalElements > 0)
    .map((result) => result.value)
    .sort((left, right) => right.totalElements - left.totalElements)
    .slice(0, 2);

  return {
    suggestions,
    hasError: results.some((result) => result.status === 'rejected'),
  };
};
