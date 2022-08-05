import styled from "styled-components";
import colors from "../../const/colors";

export const Wrapper = styled.div`
  background: rgb(175, 174, 238);
  background: linear-gradient(
    132deg,
    rgba(61, 75, 166, 1) 0%,
    rgba(35, 34, 82, 1) 83%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

export const Logo = styled.img`
  margin-top: 100px;
  width: 350px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 100px 150px;
`;

export const Header = styled.div`
  margin: 20px;
`;

export const Heading = styled.p`
  font-size: 28px;
`;

export const Text = styled.p`
  font-size: 18px;
  margin-top: 40px;
`;

export const Body = styled.div``;

export const Button = styled.div`
  color: white;
  cursor: pointer;
  padding: 8px 25px;
  width: fit-content;
  border: 1px solid white;
  border-radius: 10px;
  font-size: 18px;
  &:hover {
    opacity: 0.8;
    transition: opacity 0.2s ease-in;
  }
`;
