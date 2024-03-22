import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../Styles/Button';

// 모달 창을 스타일링한 컴포넌트
export const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  border-radius: 20px;
  padding: 20px;
  background-color: white;
`;


export const ModalBackdrop = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalView = styled.div.attrs(() => ({
  role: "dialog"
}))`
  display: flex;
  padding: 40px;
  flex-direction:column;
  justify-content:space-around;
  position: fixed;
  width: 400px;
  height: 330px;
  border-radius: 1rem;
  background-color: yellow;
  > .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #333;
  }
`;

const Modal = ({onClose, onSave}) => {

  const [ title, setTitle] = useState('');
  const [ content, setContent] = useState('');

  const changeHandler = (e) => {

    const {name , value} = e.target;
    if ( name === 'title') {
        setTitle(value);
    } else if ( name === 'content') {
        setContent(value);
    }
  };

  const handleSave = () => {
    const postData = {
      title: title,
      content: content,
    };
  
    onSave(postData); // 수정된 부분
  
    onClose();
  };

  return (
    <ModalBackdrop>
      <ModalContainer>
        <ModalView>
            <div className="close-btn" onClick={onClose}>×</div>
          
            <input
            name='title'
            className='title__input' 
            type='text' 
            placeholder='제목을 입력해주세요.' 
            value={title}
            onChange={changeHandler}
            />
            
            <hr></hr>

            <textarea 
            name='content'
            className='content__input'
            placeholder='내용을 입력해주세요.'
            rows="8" 
            cols="30"
            value={content}
            onChange={changeHandler}
            />

            <Button color='black' background='white' onClick={handleSave}>붙이기</Button>
        </ModalView>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default Modal;