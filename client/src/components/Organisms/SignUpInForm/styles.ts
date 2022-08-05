import styled from "styled-components";

export const StyledFormWrapper = styled.div`
  background: linear-gradient(
    0deg,
    rgba(45, 39, 39, 1) 0%,
    rgba(74, 74, 74, 1) 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
`;

export const StyledForm = styled.form<{ isSidebarForm?: boolean }>`
  ${(props) =>
    props.isSidebarForm
      ? `
    display: flex;
    flex-direction: column;
    color: white;
    width: 100%;
  `
      : `
  display: flex;
  justify-content: center;
  color: white;
  flex-wrap: wrap;
  max-width: 800px;
  flex-grow: 1;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.primary};
  `}
  && > * {
    margin: 12px 8px 8px;
    flex: 1 1 40%;
  }
`;

export const StyledPasswordInput = styled.input.attrs(() => ({
  type: "password",
  pattern: "",
}))``;
