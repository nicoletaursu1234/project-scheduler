import { Country } from "const/countries";
import { RouterProps } from "react-router";

export interface IUserData {
  id: number;
  email: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country?: Country;
  timezone: string;
}

export interface ISignUpData {
  email: string;
  avatar?: File;
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: string;
  country: Country;
  timezone: string;
  push?: RouterProps['history']['push'];
}

export interface IUserState extends IUserData {
  isLoading?: boolean;
}

export interface ISignInData {
  email: string;
  password: string;
  push?: RouterProps['history']['push'];
}

export interface ISignInResponse {
  accessToken: string;
  expiresIn: string;
}
