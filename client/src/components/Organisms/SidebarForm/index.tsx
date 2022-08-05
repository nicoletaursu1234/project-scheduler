import React, { useState } from "react";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
  Switch,
} from "@mui/material";
import { StyledForm } from "./styles";
import { selectCalendars } from "store/selectors/calendar";
import { useDispatch, useSelector } from "react-redux";
import { updateCalendar } from "store/calendar";

const SidebarForm = () => {
  const dispatch = useDispatch();
  const { currCalendar: calendar } = useSelector(selectCalendars);
  const [checked, setChecked] = useState(calendar?.isPublic);

  const onSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const updatedCalendar = {
      id: calendar?.id,
      isPublic: checked,
    };

    for (const [name, value] of form.entries()) {
      updatedCalendar[name] = value;
    }

    dispatch(updateCalendar(updatedCalendar));
  };

  return (
    <StyledForm onSubmit={onSubmit}>
      <FormControl>
        <InputLabel htmlFor="email-input">Name</InputLabel>
        <Input
          type="text"
          name="name"
          id="name-input"
          defaultValue={calendar?.name}
          fullWidth
          required
        />
      </FormControl>
      <FormControl sx={{ marginTop: "20px" }}>
        <InputLabel htmlFor="password-input">Description</InputLabel>
        <Input
          type="text"
          name="description"
          id="description-input"
          defaultValue={calendar?.description}
          fullWidth
        />
      </FormControl>
      <FormControl sx={{ marginTop: "20px" }}>
        <InputLabel htmlFor="member-input">Add member</InputLabel>
        <Input type="text" name="member" id="member-input" fullWidth />
      </FormControl>
      <FormControl
        sx={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginLeft: "5px",
        }}
      >
        <Typography>Public</Typography>
        <Switch checked={checked} onChange={() => setChecked(!checked)} />
      </FormControl>

      <Button type="submit">Update</Button>
    </StyledForm>
  );
};

export default SidebarForm;
