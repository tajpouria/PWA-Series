import styled from "styled-components";

export const Button = styled.button<{ primary?: boolean; round?: boolean }>`
  background: ${props => (props.primary ? "palevioletred" : "white")};
  color: ${props => (props.primary ? "white" : "palevioletred")};
  font-size: 2rem;
  margin: 1rem;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: ${props => (props.round ? "50%" : "3px")};
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    cursor: pointer;
    transform: translateY(-5px);
    box-shadow: 5px 10px 5px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    transform: translateY(0);
    box-shadow: 2px 5px 7px rgba(0, 0, 0, 0.6);
  }
`;

export const Input = styled.input`
  border: none;
  border-bottom: 1px dashed #000;
  width: 100%;
  margin: 1rem;
`;

export const Modal = styled.div<{ show: boolean; bgColor: string }>`
  display: ${props => (!props.show ? "none" : "block")};
  position: fixed;
  background: ${({ bgColor }) => bgColor};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: display 0.7s ease;
`;
