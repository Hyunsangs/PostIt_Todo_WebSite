import './Home.css';
import React, { useState, useEffect, useRef } from 'react';
import PostItCard from '../../Styles/PostCard';
import PostModal from '../../Components/PostModal';
import Button from '../../Styles/Button';
import axios from 'axios';
import UpdateModal from '../../Components/UpdateModal';
import { useAuth } from '../../Context/AuthContext';


const Home = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postItDataList, setPostItDataList] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const section2Ref = useRef(null);
  const postItCardClassName = user ? '' : 'blur';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 로그인 상태 확인
        if (user) { // user 객체가 존재하면 로그인한 것으로 간주
          const response = await axios.get('http://localhost:8080/api/postlist', {
            withCredentials: true // 쿠키를 포함시켜 요청
          });
          setPostItDataList(response.data);
          console.log("포스트잇 불러오기 성공");
        } else {
          // 로그인하지 않은 상태 처리, 예: 상태 초기화, 로그인 페이지로 리디렉트 등
          setPostItDataList([]); // 또는 다른 적절한 조치
        }
      } catch (error) {
        console.error('포스트잇 불러오기 실패:', error);
      }
    };
  
    fetchData();
  }, [user]); // 의존성 배열에 user를 추가하여 사용자 로그인 상태 변경 시 데이터 재요청

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const closeModal = () => setIsModalOpen(false);

  const toggleUpdateModal = (postId) => {
    setSelectedPostId(postId);
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  const handleSave = async (postData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/CreatePostit', postData,{
        withCredentials: true
      });
      const savedPostItCard = response.data;
      closeModal();
      setPostItDataList((prevData) => [...prevData, savedPostItCard]);
      
    } catch (error) {
      console.error('Failed to save post-it note:', error);
    }
  };

  const deleteHandler = async (id, index) => {
    try {
      await axios.delete(`http://localhost:8080/api/Deletepostit/${id}`);
      const updatedList = [...postItDataList];
      updatedList.splice(index, 1);
      setPostItDataList(updatedList);
    } catch (error) {
      console.error('Error deleting PostIt card:', error);
    }
  };

  const handleUpdate = (updatedData) => {
    const updatedList = postItDataList.map(item => (item._id === updatedData._id ? { ...item, ...updatedData } : item));
    setPostItDataList(updatedList);
  };
    
  const handleViewButtonClick = () => {
    // Scroll to section 2
    if (section2Ref.current) {
      section2Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
    
    return (
        <div className='main__container'>
            <div className='section1'>
                <div className='main__img'></div>
                <div className='section1__1'>
                    <div className='section1__1__title'><h1>나만의 TodoWeb을 경험하세요!</h1></div>
                    <div className='section1__1__content'><h3>포스트잇을 붙이는 것 처럼 나의 할일을 적어보세요.</h3></div>
                    <div className='section1__1__lookbutton' onClick={handleViewButtonClick}>💨구경하기</div>
                </div>
            </div>
            <div className='section2' ref={section2Ref}>
                {/* 버튼을 클릭하면 toggleModal 함수를 호출하여 모달을 열거나 닫음 */}
                <Button marginbottom="10px" className='write-button' onClick={toggleModal}>
                    글 작성하기
                </Button>
                <div className='main__container__board'>
                    
                    <PostItCard  className={postItCardClassName}>
                        <h3>TodoPost</h3>
                        <hr></hr>
                        <p>나의 할일을 적어보세요!</p>
                    </PostItCard>
                {
                    postItDataList.map((postItData, index) => (
                        <PostItCard key={index} className={postItCardClassName}>
                            <div className='delete-btn' onClick={() => deleteHandler(postItData._id, index)}>❎</div>
                            <h3>{postItData.title}</h3>
                            <hr></hr>
                            <p>{postItData.content}</p>
                            <div className='updateModalOpen-btn' onClick={() => toggleUpdateModal(postItData._id)}>🖊</div>
                        </PostItCard>
                    ))
                }
                </div>
            </div>

            <div className='section3' style={ {backgroundColor: 'blue'}}>
                <h1>제작자: Hyunsangs</h1>
                <h3>©CopyRight</h3>
            </div>

            {isModalOpen && <PostModal onClose={closeModal} onSave={handleSave} />}
            {isUpdateModalOpen && <UpdateModal onClose={closeUpdateModal} postId={selectedPostId} onUpdate={handleUpdate} />}
        </div>
        
    );
}

export default Home;
