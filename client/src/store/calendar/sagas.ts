import { StrictEffect } from "@redux-saga/types";
import { PayloadAction } from "@reduxjs/toolkit";
import { openSnack } from "components/Molecules/Snack/store/snackSlice";
import { Country } from "const/countries";
import LocalStorageNames from "const/localStorageNames";
import Routes from "const/routes";
import { takeLatest, call, put } from "redux-saga/effects";
import { setStorageValue } from "utils/localStorage";
import {
  calendarsGet,
  calendarGet,
  calendarCreatePost,
  calendarUpdatePut,
  calendarDelete,
  addMemberPost,
  removeMemberDelete,
} from "utils/requests";
import {
  getCalendarsSuccess,
  getCalendar,
  createCalendarSuccess,
  updateCalendarSuccess,
  deleteCalendarSuccess,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  getCalendars,
  getCalendarSuccess,
  removeMemberSuccess,
  removeMember,
} from "./index";

function* getCalendarsSaga() {
  try {
    const response = yield call(calendarsGet);

    yield put(getCalendarsSuccess(response));
  } catch (e) {
    console.error(`Calendars not fetched. Reason: ${e}`);
  }
}

function* getCalendarSaga({ payload }) {
  try {
    const response = yield call(calendarGet, payload);

    yield put(getCalendarSuccess(response));
  } catch (e) {
    console.error(`Calendar not fetched. Reason: ${e}`);
  }
}

function* createCalendarSaga({ payload }) {
  try {
    const response = yield call(calendarCreatePost, payload);

    yield put(createCalendarSuccess(response));
    yield put(openSnack({ text: `Calendar successfully created.` }));
  } catch (e) {
    yield put(
      openSnack({
        text: `Calendar was not created. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

function* updateCalendarSaga({ payload }) {
  const { push, id, member, ...calendar } = payload;

  try {
    yield call(calendarUpdatePut, id, calendar);

    let updatedCalendar;
    if (member) {
      updatedCalendar = yield call(addMemberPost, id, member);
    }

    yield put(updateCalendarSuccess(updatedCalendar));
    yield put(openSnack({ text: `Calendar successfully updated` }));
  } catch (e) {
    yield put(
      openSnack({
        text: `Calendar was not updated. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

function* deleteCalendarSaga({ payload }) {
  try {
    const response = yield call(calendarDelete, payload);

    yield put(deleteCalendarSuccess(response));
    yield put(openSnack({ text: `Calendar successfully deleted` }));
  } catch (e) {
    yield put(
      openSnack({
        text: `Calendar could not be deleted. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

function* removeMemberSaga({ payload }) {
  const { id, member } = payload;

  try {
    yield call(removeMemberDelete, id, member);

    yield put(removeMemberSuccess(member));
    yield put(openSnack({ text: `Member successfully removed` }));
  } catch (e) {
    yield put(
      openSnack({
        text: `Member was not removed. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

export function* calendarSaga(): Generator {
  yield takeLatest(getCalendar, getCalendarSaga);
  yield takeLatest(getCalendars, getCalendarsSaga);
  yield takeLatest(createCalendar, createCalendarSaga);
  yield takeLatest(updateCalendar, updateCalendarSaga);
  yield takeLatest(deleteCalendar, deleteCalendarSaga);
  yield takeLatest(removeMember, removeMemberSaga);
}
