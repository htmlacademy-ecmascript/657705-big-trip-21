import { getRandomInt } from '@src/utils/utils';
import { Price } from './const';
import { getDate } from './utils';

function generateEvent(type, destinationId, offerIds) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInt(Price.MIN, Price.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    destination: destinationId,
    isFavorite: Boolean(getRandomInt(0, 1)),
    offers: offerIds,
    type
  };
}

export { generateEvent };
