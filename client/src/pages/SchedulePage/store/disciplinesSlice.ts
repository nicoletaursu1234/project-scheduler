import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDiscipline, IDisciplineState } from '../types';

const initialState = {
  entities: [],
  disciplineInfo: {},
} as IDisciplineState;

const disciplinesSlice = createSlice({
  name: 'disciplines',
  initialState,
  reducers: {
    getDisciplinesByGroupSuccess(
      state,
      { payload }: PayloadAction<Partial<IDiscipline>[]>
    ) {
      state.entities = payload || initialState.entities;
    },
    createDisciplineSuccess(state, { payload }: PayloadAction<IDiscipline>) {
      state.entities = [payload, ...state.entities];
    },
    getDisciplineInfoSuccess(state, { payload }: PayloadAction<IDiscipline>) {
      const disciplineIndex = state.entities.findIndex(
        ({ id }) => id === payload.id
      );

      if (disciplineIndex >= 0) state.entities[disciplineIndex] = payload;
    },
  },
});

export const {
  getDisciplinesByGroupSuccess,
  createDisciplineSuccess,
  getDisciplineInfoSuccess,
} = disciplinesSlice.actions;

export default disciplinesSlice.reducer;
