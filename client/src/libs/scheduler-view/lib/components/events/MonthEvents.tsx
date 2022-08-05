import React, { Fragment } from "react";
import {
  closestTo,
  differenceInDays,
  isBefore,
  startOfDay,
  endOfDay,
  isAfter,
  isSameDay,
  isWithinInterval,
  startOfWeek,
} from "date-fns";
import { ProcessedEvent } from "../../types";
import { Typography } from "@mui/material";
import EventItem from "./EventItem";
import {
  MONTH_NUMBER_HEIGHT,
  MULTI_DAY_EVENT_HEIGHT,
} from "../../helpers/constants";

interface MonthEventProps {
  events: ProcessedEvent[];
  today: Date;
  eachWeekStart: Date[];
  daysList: Date[];
  onViewMore(day: Date): void;
  cellHeight: number;
}

const MonthEvents = ({
  events,
  today,
  eachWeekStart,
  daysList,
  onViewMore,
  cellHeight,
}: MonthEventProps) => {
  const LIMIT = Math.round(
    (cellHeight - MONTH_NUMBER_HEIGHT) / MULTI_DAY_EVENT_HEIGHT - 1
  );
  const eachFirstDayInCalcRow = eachWeekStart.some((date) =>
    isSameDay(date, today)
  )
    ? today
    : null;

  const todayEvents = events
    .filter((e) =>
      eachFirstDayInCalcRow &&
      isWithinInterval(eachFirstDayInCalcRow, {
        start: startOfDay(e.startDateTime),
        end: endOfDay(e.endDateTime),
      })
        ? true
        : isSameDay(e.startDateTime, today)
    )
    .sort((a, b) => b.endDateTime.getTime() - a.endDateTime.getTime());

  return (
    <Fragment>
      {todayEvents.map((event, i) => {
        const fromPrevWeek =
          !!eachFirstDayInCalcRow &&
          isBefore(event.startDateTime, eachFirstDayInCalcRow);
        const start =
          fromPrevWeek && eachFirstDayInCalcRow
            ? eachFirstDayInCalcRow
            : event.startDateTime;

        let eventLength = differenceInDays(event.endDateTime, start) + 1;
        const toNextWeek = eventLength >= daysList.length;
        if (toNextWeek) {
          // Rethink it
          const NotAccurateWeekStart = startOfWeek(event.startDateTime);
          const closestStart = closestTo(NotAccurateWeekStart, eachWeekStart);
          if (closestStart) {
            eventLength =
              daysList.length -
              (!eachFirstDayInCalcRow
                ? differenceInDays(event.startDateTime, closestStart)
                : 0);
          }
        }

        const prevNextEvents = events.filter((e) => {
          return (
            !eachFirstDayInCalcRow &&
            e.id !== event.id &&
            LIMIT > i &&
            isBefore(e.startDateTime, startOfDay(today)) &&
            isAfter(e.endDateTime, startOfDay(today))
          );
        });
        let index = i;

        if (prevNextEvents.length) {
          index += prevNextEvents.length;
          // if (index > LIMIT) {
          //   index = LIMIT;
          // }
        }
        const topSpace = index * MULTI_DAY_EVENT_HEIGHT + MONTH_NUMBER_HEIGHT;

        return index > LIMIT ? (
          ""
        ) : index === LIMIT ? (
          <Typography
            key={i}
            width="100%"
            className="rs__multi_day rs__hover__op"
            style={{ top: topSpace, fontSize: 11 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewMore(event.startDateTime);
            }}
          >
            {`${Math.abs(todayEvents.length - i)} More...`}
          </Typography>
        ) : (
          <div
            key={i}
            className="rs__multi_day"
            style={{
              top: topSpace,
              width: `${100 * eventLength}%`,
            }}
          >
            <EventItem
              event={event}
              showdate={false}
              multiday={
                differenceInDays(event.endDateTime, event.startDateTime) > 0
              }
              hasPrev={fromPrevWeek}
              hasNext={toNextWeek}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

export default MonthEvents;
