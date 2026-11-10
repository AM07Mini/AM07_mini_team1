import axios from 'axios';

// 교안: process.env.REACT_APP_BE_ENDPOINT → Vite: import.meta.env.VITE_BE_ENDPOINT
const server_url = import.meta.env.VITE_BE_ENDPOINT;

const api = axios.create({
  baseURL: server_url,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
