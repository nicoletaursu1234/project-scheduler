import { StrictEffect } from '@redux-saga/types';
import { PayloadAction } from '@reduxjs/toolkit';
import { openSnack } from 'components/Molecules/Snack/store/snackSlice';
import { Country } from 'const/countries';
import LocalStorageNames from 'const/localStorageNames';
import Routes from 'const/routes';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setStorageValue } from 'utils/localStorage';
import {
  avatarUpdatePost,
  signInPost,
  userCreatePost,
  userGet,
  userUpdatePut,
} from "utils/requests";
import { ISignInData, ISignInResponse, ISignUpData, IUserData } from "../types";
import {
  avatarUpdateFail,
  avatarUpdateSuccess,
  getUser,
  createUser,
  createUserFail,
  createUserSuccess,
  getUserSuccess,
  signIn,
  signInFail,
  updateUser,
  updateUserSuccess,
} from "./userSlice";

function* getUserSaga(): Generator<StrictEffect, void, IUserData> {
  try {
    const userResponse = yield call(userGet);
    console.log(userResponse);
    yield put(getUserSuccess(userResponse));
  } catch (e) {
    console.error(`User not fetched. Reason: ${e}`);
  }
}

function* createUserSaga({
  payload,
}: PayloadAction<ISignUpData>): Generator<StrictEffect, void, IUserData> {
  const { avatar, push, ...user } = payload;
  let isCreated = false;

  try {
    user.dateOfBirth = new Date(user.dateOfBirth);
    user.timezone = Country[user.country].ianaTimezone;

    const userResponse = yield call(userCreatePost, user);

    yield put(createUserSuccess(userResponse));

    isCreated = true;
    yield put(openSnack({ text: `User successfully created.` }));
  } catch (e) {
    yield put(createUserFail());
    yield put(
      openSnack({
        text: `User was not created. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }

  try {
    if (avatar?.name) {
      const form = new FormData();

      form.set("avatar", avatar);

      const avatarResponse = yield call(avatarUpdatePost, form);

      yield put(avatarUpdateSuccess(avatarResponse));
      yield put(openSnack({ text: `Avatar successfully updated.` }));
    }
  } catch (e) {
    yield put(avatarUpdateFail(e));
    yield put(
      openSnack({
        text: `Cannot update avatar. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }

  yield put(getUser());

  if (isCreated) {
    setTimeout(() => push?.(Routes.Dashboard), 1000);
  }
}

function* updateUserSaga({
  payload,
}: PayloadAction<ISignUpData>): Generator<StrictEffect, void, IUserData> {
  const { avatar, push, ...user } = payload;
  let isUpdated = false;

  try {
    user.dateOfBirth = new Date(user.dateOfBirth);
    user.timezone = Country[user.country].ianaTimezone;

    const userResponse = yield call(userUpdatePut, user);

    yield put(updateUserSuccess(userResponse));

    isUpdated = true;
    yield put(openSnack({ text: `User successfully updated.` }));
  } catch (e) {
    yield put(createUserFail());
    yield put(
      openSnack({
        text: `User was not updated. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }

  try {
    if (avatar?.name) {
      const form = new FormData();

      form.set("avatar", avatar);

      const avatarResponse = yield call(avatarUpdatePost, form);

      yield put(avatarUpdateSuccess(avatarResponse));
      yield put(openSnack({ text: `Avatar successfully updated.` }));
      yield put(getUser());
    }
  } catch (e) {
    yield put(avatarUpdateFail(e));
    yield put(
      openSnack({
        text: `Cannot update avatar. Reason: ${e.message}`,
        snackType: "error",
      })
    );
  }
}

function* signInSaga({
  payload,
}: PayloadAction<ISignInData>): Generator<StrictEffect, void, ISignInResponse> {
  try {
    const { accessToken } = yield call(signInPost, payload);

    setStorageValue(LocalStorageNames.AccessToken, accessToken);
    yield put(getUser());
    yield put(openSnack({ text: `Successfully logged in.` }));

    setTimeout(() => payload?.push?.(Routes.Dashboard), 1000);
  } catch (error) {
    yield put(signInFail());
    yield put(
      openSnack({
        text: `Login fail. Reason: ${error.message}`,
        snackType: "error",
      })
    );
  }
}

export function* userSaga(): Generator {
  yield takeLatest(getUser, getUserSaga);
  yield takeLatest(createUser, createUserSaga);
  yield takeLatest(updateUser, updateUserSaga);
  yield takeLatest(signIn, signInSaga);
}
