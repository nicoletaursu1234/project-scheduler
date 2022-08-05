import { createSelector } from "reselect";
import { IState } from "store/types";

const getState = (state: IState) => state.user;

export const selectUser = createSelector(getState, (state) => state);
