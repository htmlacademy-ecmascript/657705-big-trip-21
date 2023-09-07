import dayjs from 'dayjs';

//TODO: Перенести всё во view
function getAllDestinations(events, destinations) {
  let prevValue = '';

  const allDestinations = events.reduce((acc, current) => {
    const destinationName = destinations.find((value) => current.destination === value.id).name;

    if (prevValue !== destinationName) {
      acc.push(destinationName);
      prevValue = destinationName;
    }

    return acc;

  }, []);

  return allDestinations.join(' &mdash; ');
}

function getStartEndDate(events) {
  const startDate = dayjs(events[0].dateFrom).format('MMM D');
  const endDate = dayjs(events[events.length - 1].dateTo).format('MMM D');

  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
}

function getTotalPrice(events) {
  return events.reduce((acc, current) => acc + current.basePrice, 0);
}

export {
  getAllDestinations,
  getStartEndDate,
  getTotalPrice
};
