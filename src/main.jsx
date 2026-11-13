import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 교안 index.js와 같은 역할 — #root에 최상위 컴포넌트를 연결
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
