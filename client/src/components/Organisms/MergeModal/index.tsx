import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Checkbox,
} from "@mui/material";
import React, { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

const MergeModal = ({ isMergeModalOpen, setIsMergeModalOpen, calendars }) => {
  const { push } = useHistory();
  const [selected, setSelected] = useState([]);

  const handleChange = (e, calendar) => {
    if (selected.includes(calendar)) {
      const filteredCalendars = selected.filter((c) => {
        return c !== calendar;
      });
      setSelected(filteredCalendars);
    } else {
      setSelected([...selected, calendar]);
    }
  };

  return (
    <Dialog open={isMergeModalOpen} onClose={() => setIsMergeModalOpen(false)}>
      <DialogTitle>View combined calendars</DialogTitle>
      <DialogContent
        sx={{
          width: 500,
        }}
      >
        <CalendarList>
          {calendars?.map((calendar) => (
            <CalendarGroup key={calendar.id}>
              <Checkbox
                checked={selected.includes(calendar)}
                onChange={(e) => handleChange(e, calendar)}
                inputProps={{ "aria-label": "controlled" }}
              />
              <p style={{ marginLeft: "5px", color: "white" }}>
                {calendar.name}
              </p>
            </CalendarGroup>
          ))}
        </CalendarList>
        <DialogActions>
          <Button onClick={() => setIsMergeModalOpen(false)}>Cancel</Button>
          <Button
            type="submit"
            onClick={() =>
              push({
                pathname: `/calendars`,
                state: selected,
              })
            }
          >
            Combine
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default MergeModal;

export const CalendarList = styled.div`
  width: 100%;
`;

export const CalendarGroup = styled.div`
  display: flex;
  align-items: center;
`;
