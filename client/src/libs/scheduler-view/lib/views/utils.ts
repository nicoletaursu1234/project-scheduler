import { Country } from "const/countries";
import { formatInTimeZone } from "date-fns-tz";

export const getWorkingHours = (calendar, startHour, endHour) => {
  if (!calendar)
    return { response: { newStartHour: startHour, newEndHour: endHour } };

  const adaptedHours = calendar.members.map(({ country }) => {
    const localMemberTime = formatInTimeZone(
      new Date(),
      Country[country]?.ianaTimezone,
      "HH"
    );

    return +localMemberTime;
  });

  adaptedHours.sort((a, b) => a - b);

  const minHour = adaptedHours[0],
    maxHour = adaptedHours[adaptedHours.length - 1];

  const diff = maxHour - minHour;

  const newStartHour = startHour + diff,
    newEndHour = endHour - diff;
  if (newStartHour > newEndHour) {
    return { response: { error: "No common hours" } };
  }

  return {
    response: { newStartHour: startHour + diff, newEndHour: endHour - diff },
  };
};
