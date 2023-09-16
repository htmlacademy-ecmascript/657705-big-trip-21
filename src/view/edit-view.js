import flatpickr from 'flatpickr';
// import he from 'he';

import { html } from '@src/utils/utils';

import AbstractStatefulView from '@src/framework/view/abstract-stateful-view';

import 'flatpickr/dist/flatpickr.min.css';

export default class EditView extends AbstractStatefulView {
  #getTypeOffers = null;
  #getDestination = null;

  #handleFormSubmit = null;
  #handleArrowBtnClick = null;
  #handleDeleteBtnClick = null;

  #allTypes = null;
  #allDestinations = null;
  #dateStartPicker = null;
  #dateEndPicker = null;
  #isEdit = null;

  constructor({
    data,
    allTypes,
    allDestinations,
    getTypeOffers,
    getDestination,
    onFormSubmit,
    onUpArrowBtn,
    onDeleteBtn,
    isEdit = true
  }) {
    super();

    this._setState(data);
    this.#allTypes = allTypes;
    this.#allDestinations = allDestinations;

    this.#getTypeOffers = getTypeOffers;
    this.#getDestination = getDestination;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleArrowBtnClick = onUpArrowBtn;
    this.#handleDeleteBtnClick = onDeleteBtn;

    this.#isEdit = isEdit;

    this._restoreHandlers();
  }

  reset(event) {
    this.updateElement(event);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#dateEndPicker) {
      this.#dateEndPicker.destroy();
      this.#dateEndPicker = null;
    }

    if (this.#dateStartPicker) {
      this.#dateStartPicker.destroy();
      this.#dateStartPicker = null;
    }
  };

  /**
   * Handlers
   */

  _restoreHandlers() {
    this.element
      .addEventListener('submit', this.#formSubmitHandler);

    if (this.#isEdit) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#arrowBtnClickHandler);
    }

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    if (this._state.offers.length !== 0) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#offersChangeHandler);
    }

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteBtnClickHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.#setDatePicker();
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
    const value = evt.target.value;
    let destinationInfo = {};

    const newDestination = this.#allDestinations.find((destination) => destination.name === value);

    if (!newDestination) {
      evt.target.value = '';
    } else {
      destinationInfo = {
        ...this.#getDestination(newDestination.id)
      };
    }

    this.updateElement({
      destination: {
        ...destinationInfo
      }
    });
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.classList.contains('event__offer-checkbox')) {
      this._setState({
        offers: this._state.offers.map((offer) => {

          if (offer.id === evt.target.value) {
            return {
              ...offer,
              isSelected: evt.target.checked
            };
          }

          return {
            ...offer
          };
        })
      });
    }
  };

  #deleteBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteBtnClick(this._state);
  };

  #setDatePicker() {
    const config = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      locale: {
        firstDayOfWeek: 1
      }
    };

    this.#dateStartPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...config,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onClose: this.#dateFromCloseHandler
      }
    );

    this.#dateEndPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...config,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#dateToCloseHandler
      }
    );
  }

  #dateFromCloseHandler = ([date]) => {
    this._setState({
      dateFrom: date
    });

    this.#dateEndPicker.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([date]) => {
    this._setState({
      dateTo: date
    });

    this.#dateStartPicker.set('maxDate', this._state.dateTo);
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    let value = parseInt(evt.target.value, 10);

    if (isNaN(value) || value < 0) {
      evt.target.value = '0';
      value = 0;
    } else {
      evt.target.value = value;
    }

    this._setState({
      basePrice: value
    });
  };

  /**
   * Templates
   */

  get template() {
    return this.#createEditTemplate(this._state);
  }

  #createEditTemplate() {
    return html`
      <li class="trip-events__item">
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
      </li>
    `;
  }

  #createTypeFieldHtml() {
    const { type: currentType } = this._state;

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
        <input
          class="event__type-toggle  visually-hidden"
          id="event-type-toggle-1"
          type="checkbox"
          ${this._state.isDisabled ? 'disabled' : ''}
        >
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${this.#allTypes.map((type) => html`
              <div class="event__type-item">
                <input
                  id="event-type-${type}-1"
                  class="event__type-input  visually-hidden"
                  type="radio"
                  name="event-type"
                  value="${type}"
                  ${currentType === type ? 'checked' : ''}
                  ${this._state.isDisabled ? 'disabled' : ''}
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
    const { type, destination: currentDestination } = this._state;

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
          ${this._state.isDisabled ? 'disabled' : ''}
        >

        <datalist id="destination-list-1">
          ${this.#allDestinations.map((destination) => html`
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
          ${this._state.isDisabled ? 'disabled' : ''}
        >
        —
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input
          class="event__input  event__input--time"
          id="event-end-time-1"
          type="text"
          name="event-end-time"
          value="${dateTo}"
          ${this._state.isDisabled ? 'disabled' : ''}
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
          ${this._state.isDisabled ? 'disabled' : ''}
        >
      </div>
    `;
  }

  #createSubmitButtonHtml() {
    return html`
      <button
        class="event__save-btn  btn  btn--blue"
        type="submit"
        ${this._state.isDisabled ? 'disabled' : ''}
      >
      ${this._state.isSaving ? 'Saving...' : 'Save'}
      </button>
    `;
  }

  #createResetButtonHtml() {
    let btnText = 'Cancel';

    if (this.#isEdit) {
      console.log(this._state.isDeleting);
      btnText = this._state.isDeleting ? 'Deleting...' : 'Delete';
    }

    return html`
      <button
        class="event__reset-btn"
        type="reset"
        ${this._state.isDisabled ? 'disabled' : ''}
      >
        ${btnText}
      </button>
    `;
  }

  #createCloseButtonHtml() {
    if (!this.#isEdit) {
      return;
    }

    return html`
      <button
        class="event__rollup-btn"
        type="button"
        ${this._state.isDisabled ? 'disabled' : ''}
      >
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
              ${this._state.isDisabled ? 'disabled' : ''}
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

    if (Object.keys(this._state.destination).length === 0 || description.length === 0) {
      return;
    }

    return html`
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${pictures.length !== 0 ? html`
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${pictures.map((picture) => html`
                <img class="event__photo" src="${picture.src}" alt="${picture.description}">
              `)}
            </div>
          </div>
        ` : ''}
      </section>
    `;
  }
}
