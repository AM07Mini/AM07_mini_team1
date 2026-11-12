import api from "./axios";

// 팔로우 여부 조회
export const getFollowStatus = (userId, signal) =>
  api.get(`/follows/${userId}`, { signal }).then((res) => res.data.result);

// 팔로우
export const followUser = (userId) => api.post(`/follows/${userId}`);

// 언팔로우
export const unfollowUser = (userId) => api.delete(`/follows/${userId}`);