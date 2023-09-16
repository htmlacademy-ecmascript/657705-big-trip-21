import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';


dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

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

  static isEventFuture(dateFrom) {
    return dayjs(dateFrom).isSameOrAfter(new Date());
  }

  static isEventPast(dateTo) {
    return dayjs(dateTo).isSameOrBefore(new Date());
  }

  static isEventPresent(dateFrom, dateTo) {
    return dayjs(new Date()).isBetween(dateFrom, dateTo);
  }

  static getDurationTime(dateFrom, dateTo) {
    const timeStart = dayjs(dateFrom);
    const timeEnd = dayjs(dateTo);

    return timeEnd.diff(timeStart, 'millisecond', true);
  }

  static getStartEndDate(dateFrom, dateTo) {
    const startDate = dayjs(dateFrom).format('D MMM');
    const endDate = dayjs(dateTo).format('D MMM');

    return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
  }
}
