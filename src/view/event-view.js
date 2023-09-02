import AbstractView from '@src/framework/view/abstract-view';
import { createEventTemplate } from '@src/template/event-template';

export default class EventView extends AbstractView {
  #event = {};
  #eventDestination = {};
  #typeOffers = [];

  #handleArrowBtnClick = null;
  #handleFavoriteClick = null;

  constructor({ event, eventDestination, typeOffers, onDownArrowBtn, onFavoriteClick }) {
    super();

    this.#event = event;
    this.#eventDestination = eventDestination;
    this.#typeOffers = typeOffers;

    this.#handleArrowBtnClick = onDownArrowBtn;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#arrowBtnClickHandler);

    this.#handleFavoriteClick = onFavoriteClick;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteBtnClickHandler);
  }

  get template() {
    return createEventTemplate({
      event: this.#event,
      eventDestination: this.#eventDestination,
      typeOffers: this.#typeOffers
    });
  }

  #arrowBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleArrowBtnClick();
  };

  #favoriteBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
