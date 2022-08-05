import React, { useEffect, useCallback, Fragment } from "react";
import { Typography } from "@mui/material";
import {
  startOfWeek,
  addDays,
  format,
  eachMinuteOfInterval,
  isSameDay,
  differenceInDays,
  isBefore,
  isToday,
  setMinutes,
  setHours,
  isWithinInterval,
  isAfter,
  endOfDay,
  startOfDay,
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
import { WeekDays } from "./Month";
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
import { formatInTimeZone } from "date-fns-tz";
import { Country } from "const/countries";
import { getWorkingHours } from "./utils";
import EmptyView from "./EmptyView";

export interface WeekProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
}

const Week = ({ calendar, combinedEvents }) => {
  const dispatch = useDispatch();
  const { activities } = useSelector(selectActivities);
  const {
    week,
    selectedDate,
    height,
    triggerDialog,
    handleGotoDay,
    resources,
    resourceFields,
    fields,
    direction,
    locale,
  } = useAppState();

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

  const { weekStartOn, weekDays, startHour, endHour, step, cellRenderer } =
    week!;

  const {
    response: { error, newStartHour, newEndHour },
  } = getWorkingHours(calendar, startHour, endHour);

  if (error) return <EmptyView text={error} />;

  const _weekStart = startOfWeek(selectedDate, { weekStartsOn: weekStartOn });
  const daysList = weekDays.map((d) => addDays(_weekStart, d));
  const weekStart = startOfDay(daysList[0]);
  const weekEnd = endOfDay(daysList[daysList.length - 1]);
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
  const MULTI_SPACE = MULTI_DAY_EVENT_HEIGHT;

  const renderMultiDayEvents = (events: ProcessedEvent[], today: Date) => {
    if (!events) return;
    const isFirstDayInWeek = isSameDay(weekStart, today);
    const allWeekMulti = events.filter(
      (e) =>
        differenceInDays(new Date(e.endDateTime), new Date(e.startDateTime)) >
          0 &&
        daysList.some((weekday) =>
          isWithinInterval(weekday, {
            start: startOfDay(new Date(e.startDateTime)),
            end: endOfDay(new Date(e.endDateTime)),
          })
        )
    );

    const multiDays = allWeekMulti
      .filter((e) =>
        isBefore(new Date(e.startDateTime), weekStart)
          ? isFirstDayInWeek
          : isSameDay(new Date(e.startDateTime), today)
      )
      .sort((a, b) => b.endDateTime.getTime() - a.endDateTime.getTime());
    return multiDays.map((event, i) => {
      const hasPrev = isBefore(
        startOfDay(new Date(event.startDateTime)),
        weekStart
      );
      const hasNext = isAfter(endOfDay(new Date(event.endDateTime)), weekEnd);
      const eventLength =
        differenceInDays(
          hasNext ? weekEnd : event.endDateTime,
          hasPrev ? weekStart : event.startDateTime
        ) + 1;
      const prevNextEvents = events?.filter((e) =>
        isFirstDayInWeek
          ? false
          : e.id !== event.id &&
            isWithinInterval(today, {
              start: new Date(e.startDateTime),
              end: new Date(e.endDateTime),
            })
      );

      let index = i;
      if (prevNextEvents.length) {
        index += prevNextEvents.length;
      }

      return (
        <div
          key={event?.id}
          className="rs__multi_day"
          style={{
            top: index * MULTI_SPACE + 45,
            width: `${100 * eventLength}%`,
          }}
        >
          <EventItem
            event={event}
            hasPrev={hasPrev}
            hasNext={hasNext}
            multiday
          />
        </div>
      );
    });
  };

  const renderTable = (resource?: DefaultRecourse) => {
    let recousedEvents = events;
    if (resource) {
      recousedEvents = getResourcedEvents(
        events,
        resource,
        resourceFields,
        fields
      );
    }

    const allWeekMulti = events?.filter(
      (e) =>
        differenceInDays(new Date(e.endDateTime), new Date(e.startDateTime)) >
          0 &&
        daysList.some((weekday) =>
          isWithinInterval(weekday, {
            start: startOfDay(new Date(e.startDateTime)),
            end: endOfDay(new Date(e.endDateTime)),
          })
        )
    );
    // Equalizing multi-day section height
    const headerHeight = MULTI_SPACE * allWeekMulti?.length + 45;
    return (
      <TableGrid days={daysList?.length}>
        {/* Header days */}
        <span className="rs__cell"></span>
        {daysList.map((date, i) => (
          <span
            key={i}
            className={`rs__cell rs__header ${
              isToday(date) ? "rs__today_cell" : ""
            }`}
            style={{ height: headerHeight }}
          >
            <TodayTypo date={date} onClick={handleGotoDay} />
            {renderMultiDayEvents(recousedEvents, date)}
          </span>
        ))}

        {/* Time Cells */}
        {hours.map((h, i) => (
          <Fragment key={i}>
            <span
              style={{ height: CELL_HEIGHT }}
              className="rs__cell rs__header rs__time"
            >
              <Typography variant="caption">
                {format(h, "hh:mm a", { locale: locale })}
              </Typography>
            </span>
            {daysList?.map((date, ii) => {
              const startDateTime = new Date(
                `${format(date, "yyyy MM dd")} ${format(h, "hh:mm a")}`
              );
              const endDateTime = new Date(
                `${format(date, "yyyy MM dd")} ${format(
                  addMinutes(h, step),
                  "hh:mm a"
                )}`
              );
              const field = resourceFields.idField;
              return (
                <span
                  key={ii}
                  className={`rs__cell ${
                    isToday(date) ? "rs__today_cell" : ""
                  }`}
                >
                  {/* Events of each day - run once on the top hour column */}
                  {i === 0 && (
                    <TodayEvents
                      todayEvents={recousedEvents
                        ?.filter(
                          (e) =>
                            isSameDay(date, new Date(e.startDateTime)) &&
                            !differenceInDays(
                              new Date(e.endDateTime),
                              new Date(e.startDateTime)
                            )
                        )
                        ?.sort(
                          (a, b) =>
                            new Date(a.endDateTime).getTime() -
                            new Date(b.endDateTime).getTime()
                        )
                        ?.filter(({ startDateTime, endDateTime }) => {
                          return +format(startDateTime, "HH") >= newStartHour;
                        })}
                      today={date}
                      minuteHeight={MINUTE_HEIGHT}
                      startHour={newStartHour}
                      step={step}
                      direction={direction}
                    />
                  )}
                  {cellRenderer ? (
                    cellRenderer({
                      day: date,
                      start: startDateTime,
                      end: endDateTime,
                      height: CELL_HEIGHT,
                      onClick: () =>
                        triggerDialog(true, {
                          startDateTime,
                          endDateTime,
                          [field]: resource ? resource[field] : null,
                        }),
                      [field]: resource ? resource[field] : null,
                    })
                  ) : (
                    <Cell
                      start={startDateTime}
                      end={endDateTime}
                      resourceKey={field}
                      resourceVal={resource ? resource[field] : null}
                    />
                  )}
                </span>
              );
            })}
          </Fragment>
        ))}
      </TableGrid>
    );
  };
  return resources.length ? (
    <WithResources renderChildren={renderTable} />
  ) : (
    renderTable()
  );
};

export { Week };
