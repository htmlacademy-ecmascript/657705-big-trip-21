import { html } from '@src/utils/utils';
import AbstractStatefulView from '@src/framework/view/abstract-stateful-view';
import DateTime from '@src/utils/date-time';

export default class EventView extends AbstractStatefulView {

  #handleArrowBtnClick = null;
  #handleFavoriteBtnClick = null;

  constructor({ data, onDownArrowBtn, onFavoriteBtn }) {
    super();

    this._setState(data);

    this.#handleArrowBtnClick = onDownArrowBtn;
    this.element.querySelector('.event__rollup-btn').
      addEventListener('click', this.#arrowBtnClickHandler);

    this.#handleFavoriteBtnClick = onFavoriteBtn;
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteBtnClickHandler);
  }

  #arrowBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleArrowBtnClick();
  };

  #favoriteBtnClickHandler = (evt) => {
    evt.preventDefault();

    const changedEvent = {
      ...this._state,
      isFavorite: !this._state.isFavorite
    };

    this.#handleFavoriteBtnClick(changedEvent);
  };

  /**
   * Templates
   */

  get template() {
    return this.#createEventTemplate();
  }

  #createEventTemplate() {
    return html`
      <div class="event">
        ${this.#createStartDateHtml()}
        ${this.#createTypeIconHtml()}
        ${this.#createDestinationHtml()}
        ${this.#createScheduleHtml()}
        ${this.#createPriceHtml()}
        ${this.#createOfferListHtml()}
        ${this.#createFavoriteButtonHtml()}
        ${this.#createOpenButtonHtml()}
      </div>
    `;
  }

  #createStartDateHtml() {
    const { dateFrom } = this._state;

    return html`
      <time class="event__date" datetime="${DateTime.humanizeDateTime(dateFrom)}">${DateTime.humanizeEventDate(dateFrom)}</time>
    `;
  }

  #createTypeIconHtml() {
    const { type } = this._state;

    return html`
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
    `;
  }

  #createDestinationHtml() {
    const { type, destination } = this._state;

    return html`
      <h3 class="event__title">${type} ${destination.name}</h3>
  `;
  }

  #createScheduleHtml() {
    const { dateFrom, dateTo } = this._state;

    return html`
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${DateTime.humanizeEventTime(dateFrom)}</time>
          —
          <time class="event__end-time" datetime="2019-03-18T11:00">${DateTime.humanizeEventTime(dateTo)}</time>
        </p>
        <p class="event__duration">${DateTime.humanizeEventDiffenceTime(dateFrom, dateTo)}</p>
      </div>
    `;
  }

  #createPriceHtml() {
    const { basePrice } = this._state;
    return html`
      <p class="event__price">
        €&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
    `;
  }

  #createOfferListHtml() {
    const { offers } = this._state;
    const selectedOffers = offers.filter((offer) => offer.isSelected);

    return html`
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${selectedOffers.map((offer) => html`
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            +€&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `)}
      </ul>
    `;
  }

  #createFavoriteButtonHtml() {
    const { isFavorite } = this._state;

    return html`
      <button class="event__favorite-btn event__favorite-btn${isFavorite ? '--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path
            d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z">
          </path>
        </svg>
      </button>
    `;
  }

  #createOpenButtonHtml() {
    return html`
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    `;
  }
}
