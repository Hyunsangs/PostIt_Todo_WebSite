import React from "react";
import styled from "styled-components";

const CustomButton = styled.button`
  background-color: ${props => props.background || "#4000c7"};
  color: ${props => props.color || "white"};
  margin-bottom: ${props => (props.marginbottom || '0px')};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  
  
`;

export default function Button({children, color, background, onClick, marginbottom}) {

    const handleClick = () => {
      if(onClick) {
        onClick()
      }
    }
    return (
      <CustomButton color={color} background={background} onClick={handleClick}  marginbottom={marginbottom}>
        {children}
      </CustomButton>
    );
}