import { ActionTypes } from 'const';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISignInData, ISignInResponse, ISignUpData, IUserData, IUserState } from '../types';

const initialState: IUserState = {
  id: null,
  email: null,
  avatar: null,
  firstName: null,
  lastName: null,
  dateOfBirth: null,
  country: null,
  timezone: null,
  isLoading: false,
};

const changeIsLoading = (state: IUserState, value: boolean) => {
  state.isLoading = !!value;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state) => {
      return state;
    },
    getUserSuccess: (state, { payload }: PayloadAction<IUserData>) => {
      for (const key in payload) {
        state[key] = payload[key];
      }
    },
    createUser: (state, { payload }: PayloadAction<ISignUpData>) => {
      changeIsLoading(state, true);
    },
    createUserSuccess: (state, { payload }: PayloadAction<IUserData>) => {
      changeIsLoading(state, false);
    },
    createUserFail: (state) => {
      changeIsLoading(state, false);
    },
    // TODO change any on real data type
    avatarUpdateSuccess: (state, { payload }: PayloadAction<any>) => {
      state.avatar = payload?.avatar;
    },
    avatarUpdateFail: (state, { payload }: PayloadAction<any>) => {},
    signIn: (state, { payload }: PayloadAction<ISignInData>) => {
      changeIsLoading(state, true);
    },
    signInSuccess: (state, { payload }: PayloadAction<ISignInResponse>) => {
      changeIsLoading(state, false);
    },
    signInFail: (state, { payload }: PayloadAction<ISignInResponse>) => {
      changeIsLoading(state, false);
    },
    updateUser: (state, { payload }: PayloadAction<ISignUpData>) => {
      changeIsLoading(state, true);
    },
    updateUserSuccess: (state, { payload }: PayloadAction<IUserData>) => {
      const keys = Object.keys(payload);

      keys.forEach((key) => {
        if (key in state) state[key] = payload[key];
      });

      changeIsLoading(state, false);
    },
    updateUserFail: (state) => {
      changeIsLoading(state, false);
    },
  },
});

export const {
  avatarUpdateFail,
  avatarUpdateSuccess,
  signInFail,
  signIn,
  signInSuccess,
  getUser,
  getUserSuccess,
  createUser,
  createUserFail,
  createUserSuccess,
  updateUser,
  updateUserFail,
  updateUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
