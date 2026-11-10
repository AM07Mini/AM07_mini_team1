import { createContext } from 'react';

// 로그인 사용자 정보를 여러 화면이 함께 쓰기 위한 Context (교안 13장)
// 나중에 App에서 <AuthContext.Provider value={{ user, login, logout }}>로 감싸서 사용
const AuthContext = createContext(null);

export default AuthContext;
