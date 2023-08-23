import AbstractView from '@src/framework/view/abstract-view';
import { createEventTemplate } from '@src/template/event-template';

export default class EventView extends AbstractView {
  #event = {};
  #eventDestination = {};
  #typeOffers = [];
  #handleEditClick = null;

  constructor({ event, eventDestination, typeOffers, onEditClick }) {
    super();

    this.#event = event;
    this.#eventDestination = eventDestination;
    this.#typeOffers = typeOffers;

    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEventTemplate({
      event: this.#event,
      eventDestination: this.#eventDestination,
      typeOffers: this.#typeOffers
    });
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
