import { getRandomInt, getRandomArrayElement } from '@src/utils';
import { Price, OFFERS } from './const';

function generateOffer() {
  return {
    id: crypto.randomUUID(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomInt(Price.MIN, Price.MAX)
  };
}

export { generateOffer };
