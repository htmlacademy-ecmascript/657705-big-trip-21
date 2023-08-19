import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';

dayjs.extend(duration);

function getRandomInt(a = 1, b = 0) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomArrayElement(items) {
  return items[getRandomInt(0, items.length - 1)];
}

function humanizeEventDate(dateFrom) {
  return dayjs(dateFrom).format(DATE_FORMAT);
}

function humanizeEventTime(eventTime) {
  return dayjs(eventTime).format(TIME_FORMAT);
}

function humanizeEventDiffenceTime(dateFrom, dateTo) {
  const timeStart = dayjs(dateFrom);
  const timeEnd = dayjs(dateTo);
  const millisecond = timeEnd.diff(timeStart, 'millisecond', true);

  return dayjs.duration(millisecond).format('DD[D] HH[H] mm[M]');
}

export { getRandomArrayElement, getRandomInt, humanizeEventDate, humanizeEventTime, humanizeEventDiffenceTime };
