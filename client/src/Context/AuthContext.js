import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("x_auth");
    const userInfo = localStorage.getItem("userInfo"); // 사용자 정보를 localStorage에서 가져옴
    if (token && userInfo) {
      try {
        // const decoded = jwtDecode(token); // 예시에서는 실제로 이 코드를 사용하지 않으므로 주석 처리합니다.
        setUser(JSON.parse(userInfo)); // 디코드된 사용자 정보를 상태에 설정합니다.
      } catch (error) {
        console.error("User info decode error:", error);
      }
    }
  }, []);

  const login = ({ token, userName }) => {
    localStorage.setItem("x_auth", token); // 로그인 시 토큰을 로컬 스토리지에 저장
    localStorage.setItem("userInfo", JSON.stringify({ userName })); // 사용자 정보도 저장
    setUser({ userName }); // 상태에 사용자 정보 설정
  };

  const logout = () => {
    localStorage.removeItem("x_auth"); // 로그아웃 시 로컬 스토리지의 토큰 제거
    localStorage.removeItem("userInfo"); // 로그아웃 시 사용자 정보도 제거
    setUser(null); // 사용자 정보 상태 초기화
    alert("로그아웃 되었습니다.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
