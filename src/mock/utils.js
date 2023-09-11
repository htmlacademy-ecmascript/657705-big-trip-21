import dayjs from 'dayjs';
import { getRandomInt } from '@src/utils/utils';
import { Duration } from './const';

let date = dayjs().subtract(getRandomInt(0, Duration.DAY), 'day').toDate();

function getDate({ next }) {
  const minsGap = getRandomInt(0, Duration.MIN);
  const hoursGap = getRandomInt(1, Duration.HOUR);
  const daysGap = getRandomInt(0, Duration.DAY);

  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }

  return date;
}

export { getDate };
