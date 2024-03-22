import React, { useState, useEffect } from 'react';
import Button from '../Styles/Button';
import axios from 'axios';
import { 
    ModalBackdrop, 
    ModalContainer, 
    ModalView } 
from './PostModal.js';

const UpdateModal = ({ onClose, postId, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/postlist/${postId}`);
        const { title, content } = response.data;
        setTitle(title);
        setContent(content);
      } catch (error) {
        console.error('포스트잇 불러오기 실패:', error);
        
      }
    };

    if (postId) {
      fetchData();
    }
  }, [postId]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    name === 'title' ? setTitle(value) : setContent(value);
  };

  const updateHandler = async () => {
    try {
      const updatedData = { title, content };
      const response = await axios.put(`http://localhost:8080/api/UpdatePostit/${postId}`, updatedData);
      
      // 서버 응답을 받은 후 onUpdate 콜백 함수를 호출합니다.
      onUpdate(response.data);
      alert("수정이 완료 되었습니다.")
      onClose(); // 모달 닫기
    } catch (error) {
      console.error('포스트잇 업데이트 실패:', error);
      
    }
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
            placeholder='수정할 제목을 입력해주세요.'
            value={title}
            onChange={changeHandler}
          />

          <hr />

          <textarea
            name='content'
            className='content__input'
            placeholder='수정할 내용을 입력해주세요.'
            rows="8"
            cols="30"
            value={content}
            onChange={changeHandler}
          />

          <Button color='black' background='white' onClick={updateHandler}>수정하기</Button>
        </ModalView>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default UpdateModal;