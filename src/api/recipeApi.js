import api from './axios';

const pick = (res) => res.data.result;

export const getRecommendedRecipes = (
  { ingredientNames = [], ingredientIds = [], page = 0, size = 10 } = {},
  signal
) =>
  api
    .get('/recipes/recommendations', {
      params: { ingredientNames, ingredientIds, page, size },
      paramsSerializer: { indexes: null },
      signal,
    })
    .then(pick);