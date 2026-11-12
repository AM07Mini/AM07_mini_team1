import api from './axios';

// 요리 앨범 — 요리 모드를 끝내고 올린 완성 사진 (로그인 필요)
// 사진 한 장: { id, recipeId, recipeTitle, imageUrl, createdAt }

export const ALBUM_PAGE_SIZE = 30; // 서버 최대 50

// 내 요리 앨범 한 페이지 — 최신순, page는 0부터
// 결과: { content, page, size, totalElements, totalPages }
export const getMyAlbum = async (page, signal) => {
  const { data } = await api.get('/users/me/album', { params: { page, size: ALBUM_PAGE_SIZE }, signal, timeout: 10_000 });
  return data.result;
};

// 완성 사진 올리기 — 사진 한 장, 같은 레시피에 여러 번 올려도 이전 사진은 남음
export const ALBUM_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALBUM_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export const addAlbumPhoto = async (recipeId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  // 공용 axios 기본값이 JSON이라 사진은 multipart로 바꿔서 보냄 (프로필 사진 올리기와 같은 방식)
  // 서버가 응답하지 않아도 화면이 계속 막혀 있지 않게 30초에서 끊음 (5MB 사진 기준 넉넉하게)
  const { data } = await api.post(`/recipes/${recipeId}/album`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30_000,
  });
  return data.result;
};
