import styled from "styled-components";

export const Wrapper = styled.div`
  background: linear-gradient(
    0deg,
    rgba(45, 39, 39, 1) 0%,
    rgba(74, 74, 74, 1) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 10px;
  width: 100vw;
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  width: 70%;
`;

export const Heading = styled.p`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

export const Body = styled.div`
  width: 70%;
`;

export const Button = styled.div``;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  width: 70%;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  margin: 4px 0;
  padding: 10px;
  border-radius: 15px;
  border: 1px solid #aaa;
  width: 100%;
`;

export const Name = styled.p`
  color: #eee;
  font-weight: bold;
  font-size: 17px;
  margin: 0;
`;

export const Description = styled.span`
  color: #bbb;
  font-size: 15px;
  margin-left: 10px;
`;

export const Details = styled.div`
  display: flex;
`;

export const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 30px;
`;

export const SidebarItems = styled.div`
  display: flex;
  justify-self: flex-end;
  flex-direction: column;
  width: 100%;
`;

export const SidebarItem = styled.div`
  cursor: pointer;
  display: flex;
  > * {
    &:nth-child(2) {
      margin-left: 10px;
    }
  }
`;
