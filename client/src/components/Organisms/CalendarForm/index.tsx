import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
  Checkbox,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import { StyledForm, StyledDialogContent } from "./styles";
import { createCalendar } from "store/calendar";
import { useDispatch } from "react-redux";

const CalendarForm = ({ isFormOpen, setIsFormOpen }) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const resultObject = {
      isPublic: checked,
    };

    for (const [name, value] of form.entries()) {
      resultObject[name] = value;
    }

    dispatch(createCalendar(resultObject));

    setIsFormOpen(false);
  };

  return (
    <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)}>
      <DialogTitle>New calendar</DialogTitle>
      <StyledDialogContent
        sx={{
          width: 500,
        }}
      >
        <StyledForm onSubmit={onSubmit}>
          <FormControl>
            <InputLabel htmlFor="email-input">Name</InputLabel>
            <Input type="text" name="name" id="name-input" fullWidth required />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="password-input">Description</InputLabel>
            <Input
              type="text"
              name="description"
              id="description-input"
              fullWidth
            />
          </FormControl>
          <FormControl
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Switch checked={checked} onChange={() => setChecked(!checked)} />
            <Typography style={{ color: "#ccc" }}>Public</Typography>
          </FormControl>
          <DialogActions>
            <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </StyledForm>
      </StyledDialogContent>
    </Dialog>
  );
};

export default CalendarForm;
