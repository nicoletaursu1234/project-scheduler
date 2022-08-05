import { openSnack } from "components/Molecules/Snack/store/snackSlice";
import { takeLatest, call, put } from "redux-saga/effects";
import {
  activitiesGet,
  activityCreatePost,
  activityDelete,
  activityGet,
  activityUpdatePut,
} from "utils/requests";
import {
  createActivity,
  createActivitySuccess,
  deleteActivity,
  deleteActivitySuccess,
  getActivities,
  getActivitiesSuccess,
  getActivity,
  getActivitySuccess,
  updateActivity,
  updateActivitySuccess,
} from "./index";

function* getActivitySaga({ payload }) {
  try {
    const response = yield call(activityGet, payload);

    yield put(getActivitySuccess(response));
  } catch (e) {
    console.error(`Activity not fetched. Reason: ${e}`);
  }
}

function* getActivitiesSaga({ payload }) {
  try {
    const response = yield call(activitiesGet, payload);

    yield put(getActivitiesSuccess(response));
  } catch (e) {
    console.error(`Activities not fetched. Reason: ${e}`);
  }
}

function* createActivitySaga({ payload }) {
  const { id, ...calendar } = payload;
  console.log(calendar);
  try {
    const response = yield call(activityCreatePost, calendar);

    yield put(createActivitySuccess(response));
    yield put(openSnack({ text: `Activity successfully created` }));
  } catch (e) {
    yield put(
      openSnack({
        text: `Activity was not created. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

function* updateActivitySaga({ payload }) {
  const { id, ...activity } = payload;

  try {
    const response = yield call(activityUpdatePut, id, activity);

    yield put(updateActivitySuccess(response));
    yield put(openSnack({ text: `Activity successfully updated` }));
  } catch (e) {
    yield put(
      openSnack({
        text: `Activity was not updated. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

function* deleteActivitySaga({ payload }) {
  try {
    yield call(activityDelete, payload);

    yield put(deleteActivitySuccess(payload));
    yield put(openSnack({ text: `Activity successfully deleted` }));
  } catch (e) {
    yield put(
      openSnack({
        text: `Activity could not be deleted. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

export function* activitySaga(): Generator {
  yield takeLatest(getActivity, getActivitySaga);
  yield takeLatest(getActivities, getActivitiesSaga);
  yield takeLatest(createActivity, createActivitySaga);
  yield takeLatest(updateActivity, updateActivitySaga);
  yield takeLatest(deleteActivity, deleteActivitySaga);
}
