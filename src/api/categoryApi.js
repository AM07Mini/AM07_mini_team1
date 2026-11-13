import api from './axios';

// 조리 형태 카테고리 (메인, 국 · 찌개, 밑반찬 …) — 앱 전체가 같이 쓰는 고정 목록, 로그인 필요
// 검색 탭 필터와 마이 페이지 분류 칩이 같이 씀
// 응답은 [{ id, name }] 목록 (예전 { defaults, mine } 모양이 와도 목록으로 맞춰 돌려줌)
export const getCategories = async (signal) => {
  const { data } = await api.get('/categories', { signal, timeout: 10_000 });
  if (!data?.isSuccess) throw new Error(data?.message || '카테고리를 불러오지 못했어요.');

  const result = data.result ?? [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.defaults)) return [...result.defaults, ...(result.mine ?? [])];
  throw new Error('카테고리 응답 형식이 올바르지 않아요.');
};
