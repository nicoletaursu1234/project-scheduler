import React, { useMemo, useState } from "react";
import {
  NativeSelect,
  Input,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { COUNTRY_NAMES } from "const/countries";
import useForm from "hooks/useForm";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { createUser, updateUser } from "./store/userSlice";
import { StyledForm } from "./styles";
import { ISignUpData, IUserData } from "./types";
import { Button } from "@material-ui/core";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import UserPhoto from "../UserPhoto";

const SignUpForm = ({
  isSidebarForm,
  user,
}: {
  isSidebarForm: boolean;
  user: IUserData;
}) => {
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth || Date.now()
  );
  const [isPassword, setIsPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [country, setCountry] = useState(user?.country || "Moldova");
  const onPasswordChange = ({ target: { value } }) => setPassword(value);
  const showPassword = () => setIsPassword((state) => !state);
  const isPasswordValid = !!password.match(
    "^.*(?=.{8,120})(?!.*s)(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[!@#$%^&*()-=¡£_+`~.,<>/?;:'\"\\|[]{}]).*$"
  );
  const passwordType = isPassword ? "password" : "text";
  const Eye = isPassword ? VisibilityIcon : VisibilityOffIcon;
  const onConfirmationChange = ({ target: { value } }) =>
    setPasswordConfirmation(value);
  const isConfirmationCorrect =
    !!passwordConfirmation && password === passwordConfirmation;
  const { onSubmit } = useForm<ISignUpData>(
    isSidebarForm ? updateUser : createUser
  );
  const options = useMemo(
    () =>
      COUNTRY_NAMES.map((name) => (
        <option color="primary" key={name} value={name}>
          {name}
        </option>
      )),
    []
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledForm isSidebarForm={isSidebarForm} onSubmit={onSubmit}>
        {!isSidebarForm ? (
          <Typography
            variant="h3"
            component="h3"
            sx={{ minWidth: "100%" }}
            textAlign="center"
          >
            Create new user
          </Typography>
        ) : (
          <UserPhoto path={user?.avatar} width="100px" />
        )}
        <FormControl>
          <InputLabel htmlFor="email-input">Email</InputLabel>
          <Input
            defaultValue={user?.email}
            name="email"
            id="email-input"
            aria-describedby="email-helper-text"
            required
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="firstName-input">First Name</InputLabel>
          <Input
            defaultValue={user?.firstName}
            name="firstName"
            id="firstName-input"
            aria-describedby="firstName-helper-text"
            required
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="lastName-input">Last Name</InputLabel>
          <Input
            defaultValue={user?.lastName}
            name="lastName"
            id="lastName-input"
            aria-describedby="lastName-helper-text"
            required
          />
        </FormControl>
        <DesktopDatePicker
          value={dateOfBirth}
          onChange={setDateOfBirth}
          label="Date Of Birth"
          inputFormat="dd/MM/yyyy"
          renderInput={(params) => <TextField {...params} />}
        />
        <FormControl>
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <Input
            inputProps={{ min: "8", type: passwordType }}
            name="password"
            value={password}
            error={isPasswordValid}
            onChange={onPasswordChange}
            type="password"
            id="password-input"
            aria-describedby="password-helper-text"
            required
          />
          <IconButton
            style={{ position: "absolute", inset: "0 0 0 calc(100% - 20px)" }}
            onClick={showPassword}
          >
            <Eye />
          </IconButton>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="confirm-password-input">
            Confirm your Password
          </InputLabel>
          <Input
            inputProps={{ min: "8", type: passwordType }}
            value={passwordConfirmation}
            error={!isConfirmationCorrect}
            type="password"
            onChange={onConfirmationChange}
            id="confirm-password-input"
            aria-describedby="confirm-password-helper-text"
            required
          />
        </FormControl>
        <input type="hidden" value={dateOfBirth} name="dateOfBirth" />
        <FormControl>
          <InputLabel id="country-input">Country</InputLabel>
          <NativeSelect
            inputProps={{
              "aria-labelledby": "country-input",
              name: "country",
            }}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            {options}
          </NativeSelect>
        </FormControl>
        {!isSidebarForm ? (
          <>
            <Button variant="contained" component="label">
              Upload Avatar Image
              <input name="avatar" type="file" hidden />
            </Button>
            <Button style={{ color: "white" }} type="submit">
              Sign Up
            </Button>
          </>
        ) : (
          <Button type="submit" style={{ color: "lightblue" }}>
            Update
          </Button>
        )}
      </StyledForm>
    </LocalizationProvider>
  );
};

export default SignUpForm;
