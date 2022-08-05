import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activity: {},
  activities: [],
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    getActivity(state, { payload }) {},
    getActivitySuccess(state, { payload }) {
      state.activity = payload;
      return state;
    },
    getActivities(state, { payload }) {
      // return state;
    },
    getActivitiesSuccess(state, { payload }) {
      state.activities = payload || initialState.activities;
      return state;
    },
    createActivity(state, { payload }) {},
    createActivitySuccess(state, { payload }) {
      console.log(payload);
      state.activities.push(payload);
      return state;
    },
    updateActivity(state, { payload }) {},
    updateActivitySuccess(state, { payload }) {
      const index = state.activities.indexOf(
        state.activities.find(({ id }) => id === payload.id)
      );

      state.activities.splice(index, 1);
      state.activities.push(payload);
    },
    deleteActivity(state, { payload }) {},
    deleteActivitySuccess(state, { payload }) {
      const deleteIndex = state.activities.indexOf(
        state.activities.find(({ id }) => payload.id === id)
      );

      state.activities.splice(deleteIndex, 1);

      return state;
    },
  },
});

export const {
  getActivities,
  getActivitiesSuccess,
  createActivity,
  createActivitySuccess,
  getActivity,
  getActivitySuccess,
  updateActivity,
  updateActivitySuccess,
  deleteActivity,
  deleteActivitySuccess,
} = activitySlice.actions;

export default activitySlice.reducer;
