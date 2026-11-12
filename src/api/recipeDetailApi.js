import api from './axios';

export const getRecipeDetail = (recipeId, signal) =>
  api.get(`/recipes/${recipeId}`, { signal }).then((res) => res.data.result);

export const deleteRecipe = (recipeId) => api.delete(`/recipes/${recipeId}`);

// 좋아요
export const likeRecipe = (recipeId) => api.post(`/recipes/${recipeId}/likes`);
export const unlikeRecipe = (recipeId) => api.delete(`/recipes/${recipeId}/likes`);

// 저장
export const bookmarkRecipe = (recipeId) => api.post(`/recipes/${recipeId}/bookmarks`);
export const unbookmarkRecipe = (recipeId) => api.delete(`/recipes/${recipeId}/bookmarks`);