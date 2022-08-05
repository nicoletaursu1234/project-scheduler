import { Alert, Snackbar } from '@mui/material';
import { getUser } from "components/Organisms/SignUpInForm/store/userSlice";
import React, { PropsWithChildren, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSnack } from "./store/selectors";
import { closeSnack } from "./store/snackSlice";

const SnackProvider = ({ children }: PropsWithChildren<any>) => {
  const dispatch = useDispatch();
  const { isOpen, text, duration, snackType } = useSelector(selectSnack);
  if (localStorage.getItem("accessToken")) {
    dispatch(getUser());
  }
  const onClose = useCallback(() => {
    dispatch(closeSnack());
  }, [dispatch]);

  return (
    <>
      {children}
      <Snackbar open={isOpen} autoHideDuration={duration} onClose={onClose}>
        <Alert onClose={onClose} severity={snackType} sx={{ width: "100%" }}>
          {text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackProvider;
