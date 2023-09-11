import { FilterType } from './const';
import DateTime from './date-time';

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => DateTime.isEventFuture(event.dateFrom)),
  [FilterType.PRESENT]: (events) => events.filter((event) => DateTime.isEventPresent(event.dateFrom, event.dateTo)),
  [FilterType.PAST]: (events) => events.filter((event) => DateTime.isEventPast(event.dateTo))
};

export { filter };
