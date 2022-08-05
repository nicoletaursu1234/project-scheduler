import { createSelector } from "reselect";
import { IState } from "store/types";

const getState = (state: IState) => state.calendars;

export const selectCalendars = createSelector(getState, (state) => state);
