import {
  createDisciplineSuccess,
  getDisciplineInfoSuccess,
  getDisciplinesByGroupSuccess,
} from 'pages/SchedulePage/store/disciplinesSlice';
import { ICreateDiscipline, IDiscipline } from 'pages/SchedulePage/types';
import { StrictEffect } from '@redux-saga/types';
import { takeLatest, call, put } from 'redux-saga/effects';
import GetByDisciplineId from 'utils/DisciplineRequest/GetByDisciplineId';
import RequestByGroupId from 'utils/DisciplineRequest/GetByGroup';

import Request from 'utils/DisciplineRequest/Request';
import GetAllGroups from 'utils/DisciplineRequest/GetAllGroups';
import { getGroupsSuccess } from './groupsSlice';
import {
  createDiscipline,
  createDisciplineFail,
  getDisciplineInfo,
  getDisciplineInfoFail,
  getDisciplinesByGroup,
  getDisciplinesByGroupFail,
  getGroups,
  getGroupsFail,
} from './actions';
import PostDiscipline from 'utils/DisciplineRequest/PostDiscipline';

function* getGroupsSaga() {
  try {
    const groups = yield call(new Request(new GetAllGroups()).request);

    yield put(getGroupsSuccess(groups));
  } catch (e) {
    yield put(getGroupsFail(e.message));
  }
}

function* createDisciplineSaga({
  payload,
}: {
  payload: ICreateDiscipline;
}): Generator<StrictEffect, void, IDiscipline> {
  const modifiedPayload = {
    ...payload,
    groups: payload?.groups?.map(({ id }) => id),
  };

  try {
    const discipline = yield call(
      new Request(new PostDiscipline(modifiedPayload)).request
    );

    yield put(createDisciplineSuccess(discipline as IDiscipline));
  } catch (e) {
    yield put(createDisciplineFail());
  }
}

function* getDisciplinesByGroupSaga({
  payload: groupId,
}: {
  payload: string;
}): Generator<StrictEffect, void, Partial<IDiscipline>[]> {
  try {
    const discipline = yield call(
      new Request(new RequestByGroupId(groupId)).request
    );

    yield put(
      getDisciplinesByGroupSuccess(discipline as Partial<IDiscipline>[])
    );
  } catch (e) {
    yield put(getDisciplinesByGroupFail());
  }
}

function* getDisciplineInfoSaga({
  payload: disciplineId,
}: {
  payload: string;
}): Generator<StrictEffect, void, IDiscipline> {
  try {
    const discipline = yield call(
      new Request(new GetByDisciplineId(disciplineId)).request
    );

    yield put(getDisciplineInfoSuccess(discipline as IDiscipline));
  } catch (e) {
    yield put(getDisciplineInfoFail());
  }
}

export function* groupsSaga() {
  yield takeLatest(getGroups, getGroupsSaga);
}

export function* disciplineSaga(): Generator {
  yield takeLatest(createDiscipline, createDisciplineSaga);
  yield takeLatest(getDisciplinesByGroup, getDisciplinesByGroupSaga);
  yield takeLatest(getDisciplineInfo, getDisciplineInfoSaga);
}
