import AbstractView from '@src/framework/view/abstract-view';
import { getAllDestinations, getStartEndDate, getTotalPrice } from '@src/utils/info-utils';

function createInfoTemplate({ destinations, events }) {
  return /* html */`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getAllDestinations(events, destinations)}</h1>
        <p class="trip-info__dates">${getStartEndDate(events)}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(events)}</span>
      </p>
    </section>
  `;
}

export default class InfoView extends AbstractView {
  #destinations = [];
  #events = [];

  constructor({ destinations, events }) {
    super();
    this.#destinations = destinations;
    this.#events = events;
  }

  get template() {
    return createInfoTemplate({
      destinations: this.#destinations,
      events: this.#events
    });
  }
}
