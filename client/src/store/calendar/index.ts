import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currCalendar: null,
  calendars: [],
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    getCalendar(state, { payload }) {},
    getCalendarSuccess(state, { payload }) {
      console.error(payload);
      state.currCalendar = payload;
      return state;
    },
    getCalendars(state) {
      return state;
    },
    getCalendarsSuccess(state, { payload }) {
      state.calendars = payload || initialState.calendars;
      return state;
    },
    createCalendar(state, { payload }) {},
    createCalendarSuccess(state, { payload }) {
      state.calendars = [payload, ...state.calendars];
      return state;
    },
    updateCalendar(state, { payload }) {},
    updateCalendarSuccess(state, { payload: { calendar } }) {
      for (const key in Object.keys(calendar)) {
        state.currCalendar[key] = calendar[key];
        state.currCalendar.members = [...calendar.members];
      }

      return state;
    },
    deleteCalendar(state, { payload }) {},
    deleteCalendarSuccess(state, { payload }) {
      const deleteIndex = state.calendars.indexOf(
        state.calendars.find(({ id }) => payload.id === id)
      );

      state.calendars.splice(deleteIndex, 1);

      return state;
    },
    removeMember(state, { payload }) {},
    removeMemberSuccess(state, { payload }) {
      const deleteIndex = state.currCalendar.members.indexOf(
        state.currCalendar.members.find(({ email }) => payload === email)
      );

      state.currCalendar.members.splice(deleteIndex, 1);

      return state;
    },
  },
});

export const {
  getCalendar,
  getCalendarSuccess,
  getCalendars,
  getCalendarsSuccess,
  createCalendar,
  createCalendarSuccess,
  updateCalendar,
  updateCalendarSuccess,
  deleteCalendar,
  deleteCalendarSuccess,
  removeMember,
  removeMemberSuccess,
} = calendarSlice.actions;

export default calendarSlice.reducer;
