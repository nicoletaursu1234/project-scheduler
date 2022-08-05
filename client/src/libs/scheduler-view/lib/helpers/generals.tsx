import { addMinutes, isWithinInterval } from "date-fns";
import { View } from "../components/nav/Navigation";
import {
  DefaultRecourse,
  FieldProps,
  ProcessedEvent,
  ResourceFields,
  SchedulerProps,
} from "../types";
import { StateEvent } from "../views/Editor";

export const getOneView = (state: Partial<SchedulerProps>): View => {
  if (state.month) {
    return "month";
  } else if (state.week) {
    return "week";
  } else if (state.day) {
    return "day";
  }
  throw new Error("No views were selected");
};

export const getAvailableViews = (state: SchedulerProps) => {
  let views: View[] = [];
  if (state.month) {
    views.push("month");
  }
  if (state.week) {
    views.push("week");
  }
  if (state.day) {
    views.push("day");
  }
  return views;
};

export const arraytizeFieldVal = (
  field: FieldProps,
  val: any,
  event?: StateEvent
) => {
  const arrytize =
    field.config?.multiple &&
    !Array.isArray(event?.[field.name] || field.default);
  const value = arrytize ? (val ? [val] : []) : val;
  const validity = arrytize ? value.length : value;
  return { value, validity };
};
export const getResourcedEvents = (
  events: ProcessedEvent[],
  resource: DefaultRecourse,
  resourceFields: ResourceFields,
  fields: FieldProps[]
): ProcessedEvent[] => {
  const keyName = resourceFields.idField;
  const resourceField = fields.find((f) => f.name === keyName);
  const isMultiple = !!resourceField?.config?.multiple;

  let recousedEvents = [];

  for (const event of events) {
    // Handle single select & multiple select accordingly
    const arrytize = isMultiple && !Array.isArray(event[keyName]);
    const eventVal = arrytize ? [event[keyName]] : event[keyName];
    const isThisResource = isMultiple
      ? eventVal.includes(resource[keyName])
      : eventVal === resource[keyName];

    if (isThisResource) {
      recousedEvents.push({
        ...event,
        color: event.color || resource[resourceFields.colorField || ""],
      });
    }
  }

  return recousedEvents;
};

export const traversCrossingEvents = (
  todayEvents: ProcessedEvent[],
  event: ProcessedEvent
): ProcessedEvent[] => {
  return todayEvents.filter(
    (e) =>
      e.id !== event.id &&
      (isWithinInterval(addMinutes(event.startDateTime, 1), {
        start: e.startDateTime,
        end: e.endDateTime,
      }) ||
        isWithinInterval(addMinutes(event.endDateTime, -1), {
          start: e.startDateTime,
          end: e.endDateTime,
        }) ||
        isWithinInterval(addMinutes(e.startDateTime, 1), {
          start: event.startDateTime,
          end: event.endDateTime,
        }) ||
        isWithinInterval(addMinutes(e.endDateTime, -1), {
          start: event.startDateTime,
          end: event.endDateTime,
        }))
  );
};

export const calcMinuteHeight = (cellHeight: number, step: number) => {
  return Math.ceil(cellHeight) / step;
};
export const calcCellHeight = (tableHeight: number, hoursLength: number) => {
  return Math.max(tableHeight / hoursLength, 60);
};
