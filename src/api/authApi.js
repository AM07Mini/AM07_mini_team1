
import api from './axios';

// 중복 확인
export const checkLoginId = (loginId) =>
  api.get('/auth/login-id/check', { params: { loginId } });

export const checkNickname = (nickname) =>
  api.get('/auth/nickname/check', { params: { nickname } });

export const checkEmail = (email) =>
  api.get('/auth/email/check', { params: { email } });

// 이메일 인증
export const sendEmailCode = (email, purpose) =>
  api.post('/auth/email/code', { email, purpose });

export const verifyEmailCode = (email, code, purpose) =>
  api.post('/auth/email/verify', { email, code, purpose });

// 회원가입
export const signUp = ({ loginId, email, password, nickname, code }) =>
  api.post('/auth/signup', {
    loginId, email, password, nickname, code,
  });

// 로그인
export const signIn = (loginId, password) =>
  api.post('/auth/signin', { loginId, password });

// 아이디 찾기
export const findLoginId = (email, code) =>
  api.post('/auth/find-login-id', { email, code });


// 비밀번호 재설정 보안키 발급
export const issueResetKey = (email, code) =>
  api.post('/auth/password/reset-key', {
    email,
    code,
  });

// 비밀번호 재설정
export const resetPassword = (email, resetKey, newPassword) =>
  api.post('/auth/password/reset', {
    email,
    resetKey,
    newPassword,
  });


// 토큰 재발급 및 로그아웃
export const refreshToken = (token) =>
  api.post('/auth/refresh', {refreshToken: token});

export const logout = (refreshToken) =>
  api.post('/auth/logout', { refreshToken });
