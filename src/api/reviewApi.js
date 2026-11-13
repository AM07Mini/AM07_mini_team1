import api from './axios'

export const createReview = (recipeId, { body, rating = 5, images = [] }) => {
  const formData = new FormData();
  images.forEach((file) => formData.append("images", file));

  return api
    .post(`/recipes/${recipeId}/reviews`, formData, {
      params: { body, rating },
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.result);
};

// 후기 목록
export const getReviews = (recipeId, { page = 0, size = 20 } = {}, signal) =>
  api
    .get(`/recipes/${recipeId}/reviews`, { params: { page, size }, signal })
    .then((res) => res.data.result);

// 답글
export const getReplies = (recipeId, reviewId, { page = 0, size = 50 } = {}, signal) =>
  api
    .get(`/recipes/${recipeId}/reviews/${reviewId}/replies`, { params: { page, size }, signal })
    .then((res) => res.data.result);

export const createReply = (recipeId, reviewId, body) =>
  api.post(`/recipes/${recipeId}/reviews/${reviewId}/replies`, { body });

export const deleteReply = (recipeId, reviewId, replyId) =>
  api.delete(`/recipes/${recipeId}/reviews/${reviewId}/replies/${replyId}`);

// 후기 좋아요
export const likeReview = (recipeId, reviewId) =>
  api.post(`/recipes/${recipeId}/reviews/${reviewId}/likes`);

export const unlikeReview = (recipeId, reviewId) =>
  api.delete(`/recipes/${recipeId}/reviews/${reviewId}/likes`);