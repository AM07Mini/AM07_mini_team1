import api from '../../../api/axios';
import { getCategories } from '../../../api/categoryApi';
import { formatDifficulty } from '../../../utils/difficulty';

const CATALOG_REQUEST_TIMEOUT_MS = 10_000;
const CATEGORY_ID_GROUPS = {
  30: [20, 7],
};


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

const fetchSearchPage = async (params, signal) => {
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

  return result;
};

const mapSearchResults = (recipes) =>
  recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    image: recipe.thumbnailUrl,
    hashtags: Array.isArray(recipe.hashtags)
      ? recipe.hashtags
          .filter((hashtag) => typeof hashtag === 'string')
          .map((hashtag) => (hashtag.startsWith('#') ? hashtag : `#${hashtag}`))
      : [],
    meta:
      formatDifficulty(recipe.difficulty, recipe.cookingMinutes) ||
      '난이도 정보 없음',
  }));

const fetchCategoryUnion = async (params, categoryIds, signal, size, page) => {
  const categoryResults = await Promise.all(
    categoryIds.map(async (categoryId) => {
      const firstPage = await fetchSearchPage(
        { ...params, categoryIds: [categoryId], page: 0 },
        signal,
      );
      const pages = [firstPage];
      const totalPages = Math.ceil(firstPage.totalElements / size);

      for (let currentPage = 1; currentPage < totalPages; currentPage += 1) {
        pages.push(
          await fetchSearchPage(
            { ...params, categoryIds: [categoryId], page: currentPage },
            signal,
          ),
        );
      }

      return pages.flatMap((result) => result.content);
    }),
  );

  const uniqueRecipes = new Map();
  categoryResults.flat().forEach((recipe, index) => {
    if (!uniqueRecipes.has(recipe.id)) {
      uniqueRecipes.set(recipe.id, { recipe, index });
    }
  });
  const sortedRecipes = [...uniqueRecipes.values()].sort((left, right) => {
    const timeDifference =
      Date.parse(right.recipe.createdAt) - Date.parse(left.recipe.createdAt);
    return Number.isNaN(timeDifference) || timeDifference === 0
      ? left.index - right.index
      : timeDifference;
  });

  return {
    recipes: mapSearchResults(sortedRecipes
      .slice(page * size, (page + 1) * size)
      .map(({ recipe }) => recipe)),
    totalElements: sortedRecipes.length,
  };
};

export const fetchSearchFilterCatalogs = async (isLoggedIn, signal) => {
  const [flavorsOutcome, foodTypesOutcome, categoriesOutcome] = await Promise.allSettled([
    getResult('/flavors/catalog', signal),
    getResult('/food-types', signal),
    isLoggedIn ? getCategories(signal) : Promise.resolve([]),
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
  // 카테고리 목록은 공용 api/categoryApi.js에서 [{ id, name }] 모양으로 받아 옴
  const categories =
    categoriesOutcome.status === 'fulfilled'
      ? categoriesOutcome.value.map(({ id, name }) => ({ value: id, label: name }))
      : [];

  return [
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
      'single',
      !isLoggedIn
        ? '카테고리 필터는 로그인 후 사용할 수 있습니다.'
        : categoriesOutcome.status === 'rejected'
          ? '카테고리를 불러오지 못했습니다.'
          : '',
    ),
    makeFilter(
      'flavorIds',
      '맛',
      flavors,
      'multiple',
      flavorsOutcome.status === 'rejected' ? '맛 필터를 불러오지 못했습니다.' : '',
      2,
    ),
  ];
};

export const fetchSearchRecipes = async (keyword, filters, signal, size = 20, page = 0) => {
  const params = {
    scope: 'PUBLIC',
    page,
    size,
  };
  const normalizedKeyword = keyword.trim();

  if (normalizedKeyword) params.keyword = normalizedKeyword;
  if (filters.flavorIds.length) params.flavorIds = filters.flavorIds;
  if (filters.foodTypeId.length) params.foodTypeId = filters.foodTypeId[0];
  let expandedCategoryIds = [];
  if (filters.categoryIds.length) {
    expandedCategoryIds = filters.categoryIds.flatMap(
      (categoryId) => CATEGORY_ID_GROUPS[categoryId] ?? [categoryId],
    );
    if (expandedCategoryIds.length === 1) params.categoryIds = expandedCategoryIds;
  }
  if (filters.difficulty.length) params.difficulty = filters.difficulty[0];
  if (filters.maxCookingMinutes.length) {
    params.maxCookingMinutes = filters.maxCookingMinutes[0];
  }
  if (expandedCategoryIds.length > 1) {
    return fetchCategoryUnion(params, expandedCategoryIds, signal, size, page);
  }

  const result = await fetchSearchPage(params, signal);

  return {
    recipes: mapSearchResults(result.content),
    totalElements: result.totalElements,
  };
};

export const fetchSearchHashtags = async (filters, signal) => {
  const pageSize = 100;
  const firstPage = await fetchSearchRecipes('', filters, signal, pageSize);
  const hashtags = new Set(firstPage.recipes.flatMap((recipe) => recipe.hashtags));
  const totalPages = Math.ceil(firstPage.totalElements / pageSize);

  for (let page = 1; page < totalPages; page += 1) {
    const result = await fetchSearchRecipes('', filters, signal, pageSize, page);
    result.recipes.forEach((recipe) => recipe.hashtags.forEach((hashtag) => hashtags.add(hashtag)));
  }

  return signal.aborted ? [] : [...hashtags];
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
