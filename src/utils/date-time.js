import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export default class DateTime {
  static #DATE_FORMAT = 'MMM D';
  static #TIME_FORMAT = 'HH:mm';
  static #DATE_TIME_FORMAT = 'YYYY-MM-DD';

  static humanizeEventDate(date) {
    return dayjs(date).format(this.#DATE_FORMAT);
  }

  static humanizeDateTime(date) {
    return dayjs(date).format(this.#DATE_TIME_FORMAT);
  }

  static humanizeEventTime(time) {
    return dayjs(time).format(this.#TIME_FORMAT);
  }

  static humanizeEventDiffenceTime(dateFrom, dateTo) {
    const timeStart = dayjs(dateFrom);
    const timeEnd = dayjs(dateTo);
    const millisecond = timeEnd.diff(timeStart, 'millisecond', true);

    const dateDuration = dayjs.duration(millisecond);

    switch (true) {
      case !!dateDuration.days():
        return dayjs.duration(millisecond).format('DD[D] HH[H] mm[M]');
      case !!dateDuration.hours():
        return dayjs.duration(millisecond).format('HH[H] mm[M]');
      default:
        return dayjs.duration(millisecond).format('mm[M]');
    }
  }

}
