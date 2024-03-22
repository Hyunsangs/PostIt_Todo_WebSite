import styled from 'styled-components';
import React, { useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

    export const RegisterContainer = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fde6e6;
        height: 100vh;
        
    `;

    export const RegisterForm = styled.form`
        display: flex;
        flex-direction: column;
        
        width: 600px;
        margin: 0 auto; 
        box-shadow: 1px 2px 4px 4px rgba(208, 173, 233, 0.2);
        background-color: white;
        border-radius: 5px;
        padding: 50px 20px; 
        > h2 {
            color: #007bff; 
            display: flex;
            justify-content: center;
        }
        > label {
            
            font-size: 20px;
        
        }
    `;

    export const RegisterInput = styled.input`
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
    export const RegisterButton = styled.button`
        width: 100%;
        height: 50px;
        background-color: #8a7ef5;
        border-radius: 5px;
        color: white;

        &:hover {
            color: black;
        }
    `

const Register = () => {

    const navigate = useNavigate();

    const [ loginData, setLoginData ] = useState({
        email: '',
        userId: '',
        password: '',
        userName: '',
        userAge: '',
    });

   

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/users/register', loginData);

            console.log(res.data);
            alert("회원가입이 되었습니다.");
            navigate('/login');

        } catch (err) {
            console.error(err.response.data); 
            
        }
    };

    return (
        <RegisterContainer>
            <RegisterForm onSubmit={handleSubmit}>
                <h2>회원가입</h2>
                <label>이메일</label>
                <RegisterInput 
                name='email'
                type='text'
                value={loginData.email}
                onChange={handleChange}
                required
                placeholder='이메일을 입력해주세요.'
                />
                <label>아이디</label>
                <RegisterInput 
                name='userId'
                type='text'
                value={loginData.userId}
                onChange={handleChange}
                required
                placeholder='아이디를 입력해주세요.'
                />
                <label>비밀번호</label>
                <RegisterInput 
                name='password'
                type='password'
                value={loginData.password}
                onChange={handleChange}
                required
                placeholder='비밀번호를 입력해주세요.'
                />
                <label>이름</label>
                <RegisterInput 
                name='userName'
                type='text'
                value={loginData.userName}
                onChange={handleChange}
                required
                placeholder='이름을 입력해주세요.'
                />
                <label>나이</label>
                <RegisterInput 
                name='userAge'
                type='text'
                value={loginData.userAge}
                onChange={handleChange}
                required
                placeholder='나이를 입력해주세요.'
                />
                <RegisterButton type='submit'>회원가입</RegisterButton>
            </RegisterForm>
        </RegisterContainer>
    );
}

export default Register;