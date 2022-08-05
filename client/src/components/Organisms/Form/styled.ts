import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2.5% 20%;
  padding: 5% 10%;
  border: 2px solid #ccc;
  border-radius: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
`;

export const StyledTextField = styled(TextField)`
  width: 300px;
  margin: 20px;
`;

export const Button = styled.div`
  text-align: center;
  cursor: pointer;
  background-color: #5e88cc;
  padding: 10px 30px;
  border-radius: 15px;
  font-size: 18px;
  margin-top: 20px;
`;

export const Label = styled.p`
  font-size: 30px;
  color: #ddd;
  padding-bottom: 20px;
`
export const StyledAutocomplete = styled(Autocomplete)``;
