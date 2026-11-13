import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BE_ENDPOINT,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(sessionStorage.getItem('recipely.auth') || 'null');
    if (auth?.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
  } catch {
    // 저장된 인증 상태가 없으면 헤더를 추가하지 않음
  }
  return config;
});

export default api;