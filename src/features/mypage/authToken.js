// 로그인 토큰 꺼내기 — 마이 페이지 API 요청에 붙일 때 사용
// ⚠️ 로그인 담당이 localStorage에 저장하는 이름과 맞춰야 함 (지금은 accessToken / refreshToken 으로 가정)
// 나중에 공용 api/axios.js에서 토큰을 자동으로 붙이게 되면 이 파일은 지우기

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

// 요청 헤더에 넣을 값: { headers: authHeader() }
// 토큰이 없으면 헤더를 아예 안 붙임 ('Bearer null' 방지)
export const authHeader = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// 서버가 401을 주면 로그인이 필요하거나 만료된 것
export const isAuthError = (error) => error.response?.status === 401;
