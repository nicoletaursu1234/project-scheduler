import { AlertColor } from "@mui/material";

export interface ISnackProps {
  isOpen: boolean;
  text: string;
  snackType: AlertColor;
  duration: number;
}
