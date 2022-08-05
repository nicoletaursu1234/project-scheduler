import { createAction } from '@reduxjs/toolkit';
import { ActionTypes } from 'const';
import { ICreateDiscipline } from '../types';

export * from './groupsSlice';

export const getGroups = createAction(ActionTypes.GetGroups);
export const getGroupsFail = createAction<string>(ActionTypes.GetGroupsFail);

// Discipline Actions
export const createDiscipline = createAction<ICreateDiscipline>(ActionTypes.CreateDiscipline);
export const createDisciplineFail = createAction(ActionTypes.CreateDisciplineFail);

export const getDisciplinesByGroup = createAction<string>(ActionTypes.GetDisciplinesByGroup);
export const getDisciplinesByGroupFail = createAction(ActionTypes.GetDisciplinesByGroupFail);

export const getDisciplineInfo = createAction<string>(ActionTypes.GetDisciplineInfo);
export const getDisciplineInfoFail = createAction(ActionTypes.GetDisciplineInfoFail);