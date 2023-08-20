import { getRandomInt, getRandomArrayElement } from '@src/utils';

import { generateDestination } from '@src/mock/destination';
import { generateOffer } from '@src/mock/offer';
import { generateEvent } from '@src/mock/event';
import { TYPES, CITIES } from '@src/mock/const';

export default class MockService {
  constructor() {
    this.destinations = this.generateDestinations();
    this.offers = this.generateOffers();
    this.events = this.generateEvents();
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getEvents() {
    return this.events;
  }

  generateDestinations() {
    return CITIES.map((city) => generateDestination(city));
  }

  generateOffers() {
    return TYPES.map((type) => ({
      type,
      offers: Array.from({ length: getRandomInt(0, 5) }, () => generateOffer())
    }));
  }

  generateEvents() {
    return Array.from({ length: 10 }, () => {
      const type = getRandomArrayElement(TYPES);
      const destination = getRandomArrayElement(this.destinations);

      const hasOffers = getRandomInt(0, 1);

      const offersByType = this.offers.find((offerByType) => offerByType.type === type);

      const offersIds = (hasOffers)
        ? offersByType.offers
          .slice(0, getRandomInt(0, 5))
          .map((offers) => offers.id)
        : [];

      return generateEvent(type, destination.id, offersIds);
    });
  }
}
