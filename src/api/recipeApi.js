import axios from './axios';

export const createRecipeText = async (recipeData) => {
  const response = await axios.post('/recipes', recipeData);
  return response.data.result.id; 
};

export const uploadThumbnail = async (recipeId, imageFile) => {
  const formData = new FormData();
  formData.append('thumbnail', imageFile);

  const response = await axios.post(`/recipes/${recipeId}/thumbnail`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const searchIngredients = async (keyword) => {
  try {
    const response = await axios.get('/ingredients', {
      params: { keyword }
    });
    return response.data.result?.content || [];
  } catch (error) {
    console.error('식재료 검색 API 에러:', error);
    throw error;
  }
};

export const createIngredient = async (name) => {
  try {
    const response = await axios.post('/ingredients', { name });
    return response.data.result;
  } catch (error) {
    console.error('식재료 등록 API 에러:', error);
    throw error;
  }
};