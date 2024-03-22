import React, { useState } from "react";
import styled from 'styled-components';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext'; // useAuth import

export const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fde6e6;
    height: 100vh;
    
`;

export const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 600px;
    margin: 0 auto; 
    box-shadow: 1px 2px 4px 4px rgba(208, 173, 233, 0.2);
    background-color: white;
    border-radius: 5px;
    padding: 50px 20px; 
    > h2 {
        display: flex;
        justify-content: center;
    }
`;

export const LoginInput = styled.input`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    border: none;
    border-bottom: 2px solid #ccc; 
    outline: none;
    transition: border-bottom 0.3s ease;
    &:focus {
    border-bottom: 2px solid #007bff; 
    }
`
export const LoginButton = styled.button`
    width: 100%;
    height: 50px;
    background-color: #8a7ef5;
    border-radius: 5px;
    color: white;

    &:hover {
        color: black;
    }

`

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // 로그인 함수 가져오기
    const [ userId, setUserId ] = useState("");
    const [ password, setPassword] = useState("");

    const changeHandler = (e) => {
        const { value, name } = e.target;
        if (name === "userId") setUserId(value);
        else if (name === "password") setPassword(value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('/api/users/login', { userId, password });
        
    
            // 로그인 성공과 토큰 값 추출
            if (response.data.loginSuccess) {
                const { token, userName } = response.data;

                localStorage.setItem("x_auth", token); // localStorage에 토큰 저장

                login({ token, userName }); // 예시: login 함수에 토큰과 사용자 ID 전달

                alert("로그인 성공!");

                navigate('/'); // 홈 페이지로 이동
            } else {
                alert("로그인 실패: " + response.data.message);
            }
        } catch (error) {
            console.error("로그인 오류: ", error);
            alert("로그인 처리 중 오류 발생");
        }
    };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleLogin}>
                <h2>로그인</h2>
                
                <LoginInput 
                name="userId"
                type="text"
                value={userId}
                onChange={changeHandler}
                required
                placeholder="아이디"
                />
                <LoginInput 
                name="password"
                type="password"
                value={password}
                onChange={changeHandler}
                placeholder="비밀번호"
                required
                />
                <LoginButton type="submit">로그인</LoginButton>
            </LoginForm>
        </LoginContainer>
    );
}

export default Login;