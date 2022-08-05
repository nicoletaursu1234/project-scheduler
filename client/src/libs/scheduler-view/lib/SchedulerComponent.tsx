import React, { useEffect, useState } from "react";
import { Week } from "./views/Week";
import { Navigation } from "./components/nav/Navigation";
import { useAppState } from "./hooks/useAppState";
import Editor from "./views/Editor";
import { CircularProgress, Typography } from "@mui/material";
import { Month } from "./views/Month";
import { Day } from "./views/Day";
import { Table, Wrapper } from "./styles/styles";
import { useMemo } from "react";
import Sidebar from "./components/Sidebar";
import SidebarForm from "components/Organisms/SidebarForm";
import MemberList from "components/Molecules/MemberList";
import { useDispatch, useSelector } from "react-redux";
import { selectCalendars } from "store/selectors/calendar";
import { useHistory, useParams } from "react-router";
import { getCalendar } from "store/calendar";

const SchedulerComponent = ({ combined }) => {
  const dispatch = useDispatch();
  const {
    loading,
    view,
    dialog,
    resources,
    calendarSidebar,
    triggerCalendarSidebar,
    resourceViewMode,
  } = useAppState();
  const { id } = useParams();

  useEffect(() => {
    if (!combined) {
      dispatch(getCalendar(id));
    }
  }, [id]);

  const { currCalendar: calendar } = useSelector(selectCalendars);

  const {
    location: { state },
  } = useHistory();
  const events = (state as Array<Record<string, any>>)
    ?.map(({ activities }) => activities)
    .flat();

  const Views = useMemo(() => {
    switch (view) {
      case "month":
        return <Month calendar={calendar} combinedEvents={events} />;
      case "week":
        return <Week calendar={calendar} combinedEvents={events} />;
      case "day":
        return <Day calendar={calendar} combinedEvents={events} />;
      default:
        return "";
    }
  }, [view, calendar]);

  return (
    <Wrapper>
      {calendarSidebar && (
        <Sidebar
          triggerSidebar={triggerCalendarSidebar}
          anchorLocation="left"
          open={calendarSidebar}
        >
          <Typography
            sx={{ padding: "10px", fontSize: "20px", fontWeight: "bold" }}
          >
            About this calendar
          </Typography>
          <SidebarForm />
          <div
            style={{ width: "100%", height: "1px", border: "0.5px solid #ccc" }}
          ></div>
          <Typography
            sx={{ padding: "10px", fontSize: "20px", fontWeight: "bold" }}
          >
            Members
          </Typography>
          <MemberList />
        </Sidebar>
      )}
      {loading && (
        <div className="rs__table_loading">
          <span>
            <CircularProgress size={50} />
            <Typography align="center">Loading...</Typography>
          </span>
        </div>
      )}
      <Navigation />
      <div className="rs__outer_table">
        <Table
          resource_count={resourceViewMode === "tabs" ? 1 : resources.length}
        >
          {Views}
        </Table>
      </div>
      {dialog && <Editor />}
    </Wrapper>
  );
};

export { SchedulerComponent };
