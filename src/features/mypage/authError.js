// 서버가 401을 주면 로그인이 안 됐거나 만료된 것
// (토큰은 공용 api/axios.js가 요청마다 자동으로 붙임)
export const isAuthError = (error) => error.response?.status === 401;
