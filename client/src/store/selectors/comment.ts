import { createSelector } from "reselect";
import { IState } from "store/types";

const getState = (state: IState) => state.comments;

export const selectComments = createSelector(getState, (state) => state);
