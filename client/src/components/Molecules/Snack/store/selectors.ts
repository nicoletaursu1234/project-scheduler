import { createSelector } from "reselect";
import { IState } from "store/types";
import { ISnackProps } from "../types";

const getState = (state: IState): ISnackProps => state.snack;

export const selectSnack = createSelector(getState, (state: ISnackProps) => state);
