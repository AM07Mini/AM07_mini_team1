
import { createContext, useContext, useState } from 'react';
import { signIn, logout as logoutApi } from '../../api/authApi';

const AuthContext = createContext(null);
const STORAGE_KEY = 'recipely.auth';

const readAuth = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readAuth);

  const login = async (loginId, password) => {
    const { data } = await signIn(loginId, password);

    if (!data.isSuccess || !data.result?.accessToken) {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    const result = data.result;
    const nextAuth = {
      user: {
        userId: result.userId,
        loginId: result.loginId,
        email: result.email,
        nickname: result.nickname,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  };

  const logout = async () => {
    try {
      if (auth?.refreshToken) {
        await logoutApi(auth.refreshToken);
      }
    } finally {
      sessionStorage.removeItem(STORAGE_KEY);
      setAuth(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user: auth?.user || null,
      isLoggedIn: Boolean(auth?.accessToken),
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider가 필요합니다.');
  return context;
};