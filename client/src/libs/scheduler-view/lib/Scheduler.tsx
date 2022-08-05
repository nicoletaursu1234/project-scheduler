import React from "react";
import { AppState } from "./context/state/State";
import { defaultProps } from "./context/state/stateContext";
import { SchedulerComponent } from "./SchedulerComponent";

const Scheduler = ({ combined, ...props }) => {
  return (
    <AppState initial={props}>
      <SchedulerComponent combined />
    </AppState>
  );
};

Scheduler.defaultProps = defaultProps;

export { Scheduler };
