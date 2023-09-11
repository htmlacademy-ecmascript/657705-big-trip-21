import { FilterType } from '@src/utils/const';
import { html } from '@src/utils/utils';
import AbstractView from '@src/framework/view/abstract-view';

const NoTaskTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

export default class NoEventView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();

    this.#filterType = filterType;
  }

  get template() {
    return this.#createNoEventTemplate();
  }

  #createNoEventTemplate() {
    const noTaskText = NoTaskTextType[this.#filterType];

    return html`
      <p class="trip-events__msg">${noTaskText}</p>
    `;
  }
}
