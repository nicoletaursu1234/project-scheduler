import { IState } from 'store/types';
import { createSelector } from '@reduxjs/toolkit';

export const selectState = (state: IState) => state;

export const selectGroups = createSelector(
  selectState,
  ({ groups }) => groups.entities
);
export const selectGroupsFail = createSelector(
  selectState,
  ({ groups }) => groups.errors
);

export const selectDisciplines = createSelector(
  selectState,
  ({ disciplines }) => disciplines.entities?.map(({ date, ...discipline }) => date
    .map(({ startDate, endDate }) => ({ ...discipline, startDate, endDate }))
  ).flat()
);

export const selectDisciplineInfo = createSelector(
  selectState,
  ({ disciplines }) => disciplines.disciplineInfo
);
