import styled from "styled-components";

export const Photo = styled.div<{ width: string }>`
  cursor: pointer;
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  border-radius: 50%;
  min-height: ${(props) => props.width};
  max-height: ${(props) => props.width};
  overflow: hidden;
  width: ${(props) => props.width};
  && > img {
    width: 100%;
    height: auto;
  }
`;
