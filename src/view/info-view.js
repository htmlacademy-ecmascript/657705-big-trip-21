import { html } from '@src/utils/utils';
import DateTime from '@src/utils/date-time';

import AbstractView from '@src/framework/view/abstract-view';
import { getDestinationsTemplate } from '@src/utils/info';

export default class InfoView extends AbstractView {
  #infoData = {};

  constructor({ data }) {
    super();

    this.#infoData = data;
  }

  get template() {
    return this.#createInfoTemplate();
  }

  #createInfoTemplate() {
    const { date, destinations, price, length } = this.#infoData;

    return html`
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${getDestinationsTemplate(destinations, length)}</h1>
          <p class="trip-info__dates">${DateTime.getStartEndDate(date.from, date.to)}</p>
        </div>
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
        </p>
      </section>
    `;
  }
}
