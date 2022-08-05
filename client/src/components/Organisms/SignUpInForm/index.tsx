import LocalStorageNames from 'const/localStorageNames';
import React, { useRef } from 'react';
import { Redirect } from 'react-router';
import { getStorageValue } from 'utils/localStorage';
import Routes from 'const/routes';
import SignUpForm from './SignUpForm';
import { StyledFormWrapper } from './styles';
import SignInForm from './SignInForm';
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const SignUpInForm = ({
  signUpForm,
  history,
}: {
  signUpForm?: boolean;
  history: any;
}) => {
  const token = useRef(!!getStorageValue(LocalStorageNames.AccessToken));
  const Form = signUpForm ? SignUpForm : SignInForm;

  if (token.current) return <Redirect to={Routes.Dashboard} />;

  return (
    <StyledFormWrapper>
      <div>
        <Form />
      </div>
      <Typography style={{ color: "white" }}>
        {!signUpForm ? (
          <>
            Don't have an account?{" "}
            <Link to="/sign-up" onClick={() => history.push("/sign-up")}>
              Sign up
            </Link>
          </>
        ) : (
          <>
            Have an account?{" "}
            <Link to="/sign-in" onClick={() => history.push("/sign-in")}>
              Log in
            </Link>
          </>
        )}
      </Typography>
    </StyledFormWrapper>
  );
};

export default SignUpInForm;
