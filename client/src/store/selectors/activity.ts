import { createSelector } from "reselect";
import { IState } from "store/types";

const getState = (state: IState) => state.activities;

export const selectActivities = createSelector(getState, (state) => state);
