import DateTime from './date-time';

function sortPriceInDescOrder(a, b) {
  return b.basePrice - a.basePrice;
}

function sortDurationTimeInDescOrder(a, b) {
  return DateTime.getDurationTime(b.dateFrom, b.dateTo) - DateTime.getDurationTime(a.dateFrom, a.dateTo);
}

function sortByDaysInDescOrder(a, b) {
  return a.dateFrom - b.dateFrom;
}

export {
  sortPriceInDescOrder,
  sortDurationTimeInDescOrder,
  sortByDaysInDescOrder
};
