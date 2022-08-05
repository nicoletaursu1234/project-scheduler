import addZero from 'utils/addZero';

export default ({ startDate, endDate }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startTime = `${addZero(start.getHours())}:${addZero(start.getMinutes())}`;
  const endTime = `${addZero(end.getHours())}:${addZero(end.getMinutes())}`;

  return `${startTime} - ${endTime}`;
}