import { getRandomArrayElement } from '@src/utils';
import { DESCRIPTIONS } from './const';

function generateDestination(city) {
  return {
    id: crypto.randomUUID(),
    name: city,
    description: getRandomArrayElement(DESCRIPTIONS),
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
        description: `Photo ${city} description`
      }
    ]
  };
}

export { generateDestination };
