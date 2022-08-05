import React, { useEffect, useCallback, Fragment } from "react";
import { Typography } from "@mui/material";
import {
  format,
  eachMinuteOfInterval,
  isSameDay,
  differenceInDays,
  isToday,
  isWithinInterval,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  addDays,
  addMinutes,
} from "date-fns";
import TodayTypo from "../components/common/TodayTypo";
import EventItem from "../components/events/EventItem";
import { useAppState } from "../hooks/useAppState";
import {
  CellRenderedProps,
  DayHours,
  DefaultRecourse,
  ProcessedEvent,
} from "../types";
import {
  calcCellHeight,
  calcMinuteHeight,
  getResourcedEvents,
} from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";
import { Cell } from "../components/common/Cell";
import TodayEvents from "../components/events/TodayEvents";
import { TableGrid } from "../styles/styles";
import { MULTI_DAY_EVENT_HEIGHT } from "../helpers/constants";
import { useDispatch, useSelector } from "react-redux";
import { selectActivities } from "store/selectors/activity";
import { getActivities } from "store/activity";
import { getWorkingHours } from "./utils";
import EmptyView from "./EmptyView";

export interface DayProps {
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
}

const Day = ({ calendar, combinedEvents }) => {
  const {
    day,
    selectedDate,
    height,
    triggerDialog,
    resources,
    resourceFields,
    fields,
    direction,
    locale,
  } = useAppState();
  const dispatch = useDispatch();
  const { activities } = useSelector(selectActivities);

  useEffect(() => {
    if (calendar && !combinedEvents?.length)
      dispatch(getActivities(calendar.id));
  }, [calendar]);

  const source = combinedEvents || activities;
  const events = source?.map((activity) => ({
    ...activity,
    startDateTime: new Date(activity.startDateTime),
    endDateTime: new Date(activity.endDateTime),
  }));

  const { startHour, endHour, step, cellRenderer } = day!;
  const {
    response: { error, newStartHour, newEndHour },
  } = getWorkingHours(calendar, startHour, endHour);

  if (error) return <EmptyView text={error} />;

  const START_TIME = setMinutes(setHours(selectedDate, newStartHour), 0);
  const END_TIME = setMinutes(setHours(selectedDate, newEndHour), 0);
  const hours = eachMinuteOfInterval(
    {
      start: START_TIME,
      end: END_TIME,
    },
    { step: step }
  );
  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);
  const todayEvents = events
    .sort((b, a) => a.endDateTime.getTime() - b.endDateTime.getTime())
    .filter(
      ({ startDateTime, endDateTime }) =>
        +format(startDateTime, "HH") >= newStartHour
    );

  const renderMultiDayEvents = (events: ProcessedEvent[]) => {
    const multiDays = events.filter(
      (e) =>
        differenceInDays(e.endDateTime, e.startDateTime) > 0 &&
        isWithinInterval(selectedDate, {
          start: startOfDay(e.startDateTime),
          end: endOfDay(e.endDateTime),
        })
    );

    return (
      <div
        className="rs__block_col"
        style={{ height: MULTI_DAY_EVENT_HEIGHT * multiDays.length }}
      >
        {multiDays.map((event, i) => {
          const hasPrev = isBefore(
            event.startDateTime,
            startOfDay(selectedDate)
          );
          const hasNext = isAfter(event.endDateTime, endOfDay(selectedDate));
          return (
            <div
              key={event.id}
              className="rs__multi_day"
              style={{
                top: i * MULTI_DAY_EVENT_HEIGHT,
                width: "100%",
              }}
            >
              <EventItem
                event={event}
                multiday
                hasPrev={hasPrev}
                hasNext={hasNext}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderTable = (resource?: DefaultRecourse) => {
    let recousedEvents = todayEvents;
    if (resource) {
      recousedEvents = getResourcedEvents(
        todayEvents,
        resource,
        resourceFields,
        fields
      );
    }

    const allWeekMulti = events.filter(
      (e) =>
        differenceInDays(e.endDateTime, e.startDateTime) > 0 &&
        isWithinInterval(selectedDate, {
          start: startOfDay(e.startDateTime),
          end: endOfDay(e.endDateTime),
        })
    );

    const headerHeight = MULTI_DAY_EVENT_HEIGHT * allWeekMulti.length + 45;
    return (
      <TableGrid days={1}>
        {/* Header */}
        <span className="rs__cell"></span>
        <span
          className={`rs__cell rs__header ${
            isToday(selectedDate) ? "rs__today_cell" : ""
          }`}
          style={{ height: headerHeight }}
        >
          <TodayTypo date={selectedDate} />
          {renderMultiDayEvents(recousedEvents)}
        </span>

        {/* Body */}
        {hours.map((h, i) => {
          const start = new Date(
            `${format(selectedDate, "yyyy MM dd")} ${format(h, "hh:mm a")}`
          );
          const end = new Date(
            `${format(selectedDate, "yyyy MM dd")} ${format(
              addMinutes(h, step),
              "hh:mm a"
            )}`
          );
          const field = resourceFields.idField;

          return (
            <Fragment key={i}>
              {/* Time Cells */}
              <span
                className="rs__cell rs__header rs__time"
                style={{ height: CELL_HEIGHT }}
              >
                <Typography variant="caption">
                  {format(h, "hh:mm a", { locale: locale })}
                </Typography>
              </span>

              <span
                className={`rs__cell ${
                  isToday(selectedDate) ? "rs__today_cell" : ""
                }`}
              >
                {/* Events of this day - run once on the top hour column */}
                {i === 0 && (
                  <TodayEvents
                    todayEvents={recousedEvents.filter(
                      (e) =>
                        !differenceInDays(e.endDateTime, e.startDateTime) &&
                        isSameDay(selectedDate, e.startDateTime)
                    )}
                    today={selectedDate}
                    minuteHeight={MINUTE_HEIGHT}
                    startHour={newStartHour}
                    step={step}
                    direction={direction}
                  />
                )}
                {/* Cell */}
                {cellRenderer ? (
                  cellRenderer({
                    day: selectedDate,
                    start,
                    end,
                    height: CELL_HEIGHT,
                    onClick: () =>
                      triggerDialog(true, {
                        startDateTime: start,
                        endDateTime: end,
                        [field]: resource ? resource[field] : null,
                      }),
                    [field]: resource ? resource[field] : null,
                  })
                ) : (
                  <Cell
                    start={start}
                    end={end}
                    resourceKey={field}
                    resourceVal={resource ? resource[field] : null}
                  />
                )}
              </span>
            </Fragment>
          );
        })}
      </TableGrid>
    );
  };

  return resources.length ? (
    <WithResources span={2} renderChildren={renderTable} />
  ) : (
    renderTable()
  );
};;

export { Day };
