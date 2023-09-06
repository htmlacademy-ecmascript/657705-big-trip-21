import { html } from '@src/utils/utils';

import AbstractStatefulView from '@src/framework/view/abstract-stateful-view';

export default class EditView extends AbstractStatefulView {
  #getTypeOffers = null;
  #getDestination = null;

  #handleFormSubmit = null;
  #handleArrowBtnClick = null;

  constructor({ data, getTypeOffers, getDestination, onFormSubmit, onUpArrowBtn }) {
    super();

    this._setState(data);

    this.#getTypeOffers = getTypeOffers;
    this.#getDestination = getDestination;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleArrowBtnClick = onUpArrowBtn;

    this._restoreHandlers();
  }

  /**
   * Handlers
   */

  _restoreHandlers() {
    this.element
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#arrowBtnClickHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #arrowBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleArrowBtnClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();

    const newOffers = this.#getTypeOffers(evt.target.value);

    this.updateElement({
      type: evt.target.value,
      offers: newOffers.map((offer) => ({
        ...offer,
        isSelected: false
      }))
    });
  };

  #destinationChangeHandler = (evt) => {
    const newDestination = this._state.allDestinations.find((destination) => destination.name === evt.target.value);

    if (!newDestination) {
      return;
    }

    const newDestinationInfo = this.#getDestination(newDestination.id);

    this.updateElement({
      destination: {
        ...newDestinationInfo
      }
    });
  };

  /**
   * Templates
   */

  get template() {
    return this.#createEditTemplate(this._state);
  }

  reset(event) {
    this.updateElement(event);
  }

  #createEditTemplate() {
    return html`
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${this.#createTypeFieldHtml()}
          ${this.#createDestinationFieldHtml()}
          ${this.#createScheduleFieldHtml()}
          ${this.#createPriceFieldHtml()}
          ${this.#createSubmitButtonHtml()}
          ${this.#createResetButtonHtml()}
          ${this.#createCloseButtonHtml()}
        </header>
        <section class="event__details">
          ${this.#createOfferListFieldHtml()}
          ${this.#createDestinationHtml()}
        </section>
      </form>
    `;
  }

  #createTypeFieldHtml() {
    const { type: currentType, allTypes } = this._state;

    return html`
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img
            class="event__type-icon"
            width="17"
            height="17"
            src="img/icons/${currentType}.png"
            alt="Event type icon"
          >
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${allTypes.map((type) => html`
              <div class="event__type-item">
                <input
                  id="event-type-${type}-1"
                  class="event__type-input  visually-hidden"
                  type="radio"
                  name="event-type"
                  value="${type}"
                  ${currentType === type ? 'checked' : ''}
                >
                <label
                  class="event__type-label  event__type-label--${type}"
                  for="event-type-${type}-1"
                >
                  ${type}
                </label>
              </div>
            `)}
          </fieldset>
        </div>
      </div>
    `;
  }

  #createDestinationFieldHtml() {
    const { type, destination: currentDestination, allDestinations } = this._state;

    return html`
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input
          class="event__input  event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="${currentDestination.name}"
          list="destination-list-1"
        >

        <datalist id="destination-list-1">
          ${allDestinations.map((destination) => html`
            <option value="${destination.name}"></option>
          `)}
        </datalist>
      </div>
    `;
  }

  #createScheduleFieldHtml() {
    const { dateFrom, dateTo } = this._state;

    return html`
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input
          class="event__input  event__input--time"
          id="event-start-time-1"
          type="text"
          name="event-start-time"
          value="${dateFrom}"
        >
        —
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input
          class="event__input  event__input--time"
          id="event-end-time-1"
          type="text"
          name="event-end-time"
          value="${dateTo}"
        >
      </div>
    `;
  }

  #createPriceFieldHtml() {
    const { basePrice } = this._state;
    return html`
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          €
        </label>
        <input
          class="event__input  event__input--price"
          id="event-price-1"
          type="text"
          name="event-price"
          value="${basePrice}"
        >
      </div>
    `;
  }

  #createSubmitButtonHtml() {
    return html`
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    `;
  }

  #createResetButtonHtml() {
    return html`
      <button class="event__reset-btn" type="reset">Delete</button>
    `;
  }

  #createCloseButtonHtml() {
    return html`
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>
    `;
  }

  #createOfferListFieldHtml() {
    const { offers } = this._state;

    if (offers.length === 0) {
      return;
    }

    return html`
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offers.map((offer) => html`
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox  visually-hidden"
              id="event-offer-${offer.id}-1"
              type="checkbox"
              name="event-offer"
              value="${offer.id}"
              ${offer.isSelected ? 'checked' : ''}
            >
            <label class="event__offer-label" for="event-offer-${offer.id}-1">
              <span class="event__offer-title">${offer.title}</span>
              +€&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `)}
        </div>
      </section>
    `;
  }

  #createDestinationHtml() {
    const { description, pictures } = this._state.destination;

    return html`
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pictures.map((picture) => html`
              <img class="event__photo" src="${picture.src}" alt="${picture.description}">
            `)}
          </div>
        </div>
      </section>
    `;
  }
}
