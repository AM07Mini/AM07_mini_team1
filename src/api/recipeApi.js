import api from './axios';

export const createRecipeText = async (recipeData) => {
  const response = await api.post('/recipes', recipeData);
  return response.data.result.id; 
};

export const uploadThumbnail = async (recipeId, imageFile) => {
  const formData = new FormData();
  formData.append('thumbnail', imageFile);

  const response = await api.post(`/recipes/${recipeId}/thumbnail`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const searchIngredients = async (keyword) => {
  try {
    const response = await api.get('/ingredients', {
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
    const response = await api.post('/ingredients', { name });
    return response.data.result;
  } catch (error) {
    console.error('식재료 등록 API 에러:', error);
    throw error;
  }
  
};

// 내 식재료 전체 교체
export const updateMyIngredients = async (ingredientIds) => {
  try {
    const response = await api.put('/users/me/ingredients', { ingredientIds });
    return response.data;
  } catch (error) {
    console.error('내 식재료 저장 API 에러:', error);
    throw error;
  }
};

export const uploadStepImage = async (recipeId, stepOrder, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const token = localStorage.getItem('accessToken');

  const response = await api.post(
    `/recipes/${recipeId}/step-images?stepOrder=${stepOrder}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};
