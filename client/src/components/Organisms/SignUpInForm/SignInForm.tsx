import { Button, FormControl, FormHelperText, Input, InputLabel, Typography } from '@mui/material';
import useForm from 'hooks/useForm';
import React from 'react';
import { signIn } from './store/userSlice';
import { StyledForm } from './styles';
import { ISignInData } from './types';

const SignInForm = () => {
    const { onSubmit } = useForm<ISignInData>(signIn);

    return (
      <StyledForm onSubmit={onSubmit}>
        <Typography
          sx={{ minWidth: "100%" }}
          textAlign="center"
          variant="h3"
          component="h3"
        >
          Sign in
        </Typography>

        <FormControl>
          <InputLabel htmlFor="email-input">Email</InputLabel>
          <Input
            type="email"
            name="email"
            id="email-input"
            aria-describedby="email-helper-text"
            required
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <Input
            inputProps={{ min: 8 }}
            type="password"
            name="password"
            id="password-input"
            aria-describedby="password-helper-text"
            required
          />
        </FormControl>

        <Button style={{ color: "white", padding: "5px 10px" }} type="submit">
          Sign in
        </Button>
      </StyledForm>
    );
};

export default SignInForm;
