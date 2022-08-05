import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionTypes } from 'const';
import { IGroup, IGroupsState } from '../types';

const initialState = {
  entities: [],
  errors: [],
} as IGroupsState;

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    getGroupsSuccess(state, { payload }: PayloadAction<IGroup[]>) {
      state.entities = payload || initialState.entities;
    },
    [ActionTypes.GetGroupsFail]: (state, { payload }: PayloadAction<string>) => {
      state.errors.push(payload);
    },
    [ActionTypes.GetGroups]: (state) => {
      state.errors = [];
    },
  },
});

export const { getGroupsSuccess } = groupsSlice.actions;

export default groupsSlice.reducer;