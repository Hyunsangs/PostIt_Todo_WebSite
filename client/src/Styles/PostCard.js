import styled from "styled-components";

const PostItCard = styled.div`
    position: relative;
    background-color: #ffeb3b;
    border: 2px solid #ffca28;
    padding: 15px;
    width: 200px;
    height: 200px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    margin: 20px;
    border-radius: 8px;
    > .delete-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        color: #333;
      }
    > .updateModalOpen-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        cursor: pointer;
        
    }
`
export default PostItCard;