import axios, { AxiosResponse } from "axios";
import {
  ISignInData,
  ISignInResponse,
  ISignUpData,
} from "components/Organisms/SignUpInForm/types";
import Endpoints from "const/endpoints";
import LocalStorageNames from "const/localStorageNames";
import { getStorageValue, setStorageValue } from "utils/localStorage";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

let accessToken = getStorageValue(LocalStorageNames.AccessToken) || "";

axiosInstance.interceptors.response.use(
  (response): AxiosResponse["data"] => {
    accessToken = response?.data?.accessToken || accessToken;
    setStorageValue(LocalStorageNames.AccessToken, accessToken);

    return response.data;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.request.use(
  (request) => {
    request.headers["Authorization"] = `Bearer ${accessToken}`;

    return request;
  },
  (error) => {
    return Promise.reject(error.data);
  }
);

export const userGet = () => axiosInstance.get(Endpoints.UserGet);
export const userCreatePost = (userData: ISignUpData) =>
  axiosInstance.post(Endpoints.UserCreate, userData);
export const userUpdatePut = (userData: ISignUpData) =>
  axiosInstance.put(Endpoints.UserUpdate, userData);
export const avatarUpdatePost = (formData: FormData) =>
  axiosInstance.post(Endpoints.AvatarUpdate, formData);
export const signInPost = (
  credentials: ISignInData
): Promise<ISignInResponse> =>
  axiosInstance.post(Endpoints.SignIn, credentials);

export const calendarGet = (id) =>
  axiosInstance.get(`${Endpoints.Calendar}/${id}`);
export const calendarsGet = () => axiosInstance.get(Endpoints.CalendarsGet);
export const calendarCreatePost = (data) =>
  axiosInstance.post(Endpoints.CalendarPost, data);
export const calendarUpdatePut = (id, data) =>
  axiosInstance.put(`${Endpoints.Calendar}/${id}`, data);
export const calendarDelete = (id) =>
  axiosInstance.delete(`${Endpoints.Calendar}/${id}`);
export const addMemberPost = (id, member) =>
  axiosInstance.post(Endpoints.MemberInvite, {
    member,
    id,
  });
export const removeMemberDelete = (id, member) =>
  axiosInstance.post(Endpoints.MemberRemove, {
    member,
    id,
  });

export const activityGet = (id) =>
  axiosInstance.get(`${Endpoints.Activity}/${id}`);
export const activitiesGet = (calendarId) =>
  axiosInstance.get(`${Endpoints.ActivitiesGet}/${calendarId}`);
export const activityCreatePost = (data) =>
  axiosInstance.post(Endpoints.Activity, data);
export const activityUpdatePut = (id, data) =>
  axiosInstance.put(`${Endpoints.Activity}/${id}`, data);
export const activityDelete = (id) =>
  axiosInstance.delete(`${Endpoints.Activity}/${id}`);

export const commentsGet = (id) => axiosInstance.get(`${Endpoints.CommentsGet}/${id}`);
export const commentCreatePost = (id, data) =>
  axiosInstance.post(`${Endpoints.CommentPost}/${id}`, data);
export const commentDelete = (id) =>
  axiosInstance.delete(`${Endpoints.CommentDelete}/${id}`);

export default axiosInstance;
