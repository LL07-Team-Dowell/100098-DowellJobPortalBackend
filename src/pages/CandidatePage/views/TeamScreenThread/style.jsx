import styled from "styled-components";

export const Wrappen = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2rem;
  padding-top: 30px;
  flex-direction: row;
  width: 32%;
  margin-right: auto;
  margin-left: auto;
  a {
    border-radius: 10px;
    background: #f3f8f4;
    color: #b8b8b8;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 1rem;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.01em;
    cursor: pointer;
    width: 10rem;
    height: 3rem;
    transition: 0.3s ease-in-out;
    text-align: center;
  }
  .isActive {
    background: #005734;
    box-shadow: 0px 2.79922px 25px rgba(0, 87, 52, 0.67);
    color: #fff;
  }
`;
