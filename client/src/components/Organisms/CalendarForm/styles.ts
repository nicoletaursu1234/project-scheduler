import styled from "styled-components";
import { DialogContent } from "@mui/material";

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const StyledDialogContent = styled(DialogContent)`
  && {
    padding-top: 5px !important;
  }
`;
