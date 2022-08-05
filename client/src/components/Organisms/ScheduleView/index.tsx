import React, { useRef, useState, useEffect } from "react";
import { Scheduler } from "../../../libs/scheduler-view/lib/Scheduler";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCalendar } from "store/calendar";
import { selectCalendars } from "store/selectors/calendar";

export default () => {
  const { currCalendar: calendar } = useSelector(selectCalendars);
  const dispatch = useDispatch();
  const schedulerRef = useRef();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getCalendar(id));
  }, []);

  return (
    <div ref={schedulerRef}>
      <Scheduler
        color="white"
        view="week"
        events={calendar?.activities}
        calendar={calendar}
      />
    </div>
  );
};
