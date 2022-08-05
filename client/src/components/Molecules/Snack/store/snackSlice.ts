import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISnackProps } from "../types";

const initialState: ISnackProps = {
  isOpen: false,
  text: "",
  type: "success",
  duration: 6000,
};

const snackSlice = createSlice({
  name: "snack",
  initialState,
  reducers: {
    openSnack: (
      state,
      { payload }: PayloadAction<Omit<Optional<ISnackProps>, "isOpen">>
    ) => {
      const keys = Object.keys(payload);
      const result = {};

      state.text = payload.text || initialState.text;
      state.snackType = payload.snackType || initialState.snackType;
      state.duration = payload.duration || initialState.duration;
      state.isOpen = true;
    },
    closeSnack: (state) => {
      state.isOpen = initialState.isOpen;
      state.text = initialState.text;
      state.snackType = initialState.snackType;
      state.duration = initialState.duration;
    },
  },
});

export const { openSnack, closeSnack } = snackSlice.actions;

export default snackSlice.reducer;
