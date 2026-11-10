import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 백엔드 CORS가 localhost:3000만 허용하므로 교안(CRA)과 같은 3000번 포트 사용
    port: 3000,
  },
});
