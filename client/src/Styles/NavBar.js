import React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { useAuth } from '../Context/AuthContext'; // 경로 확인 필요
import Button from './Button';

const NavContainer = styled.div`
    font-weight: bold;
    font-size: 20px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    padding: 0 60px;
    justify-content: space-between;
    align-items: center;
    background-color: #f8f9fa; // 배경색 추가 예시
    z-index: 1;
`;

const NavLoginContainer = styled.div`
    display: flex;
    > .login_user {
        margin-right: 50px;
        display: flex;
        align-items: center;
    }
    > .login_user span {
        margin-left: 10px;
        color: blue;
    }
` 

const Navbar = () => {
  const { user, logout } = useAuth();
    
  return (
    <NavContainer>
      <Link to="/"><p>PostItToDo</p></Link>
      <NavLoginContainer>
        {user ? (
          <>
            <div className='login_user'>환영합니다<span> {user.userName}님</span></div> {/* 사용자 이름 표시 */}
            
            <Button color='white' background='grey' onClick={logout}>로그아웃</Button>
          </>
        ) : (
          <>
            <Link to="/login" className='login_user'><p>로그인</p></Link>
            <Link to="/register"><p>회원가입</p></Link>
          </>
        )}
      </NavLoginContainer>
    </NavContainer>
  );
};

export default Navbar;