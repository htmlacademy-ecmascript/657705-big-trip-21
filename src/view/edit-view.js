import { capitalize } from '@src/utils';
import AbstractStatefulView from '@src/framework/view/abstract-stateful-view';
import { createEditTemplate } from '@src/template/form/form-template';

export default class EditView extends AbstractStatefulView {
  #event = {};
  #eventDestination = {};
  #typeOffers = [];

  #getTypeOffers = null;

  #handleFormSubmit = null;
  #handleArrowBtnClick = null;

  constructor({ event, eventDestination, typeOffers, onFormSubmit, onUpArrowBtn, getTypeOffers }) {
    super();

    this._setState({
      event,
      eventDestination,
      typeOffers
    });

    this.#getTypeOffers = getTypeOffers;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleArrowBtnClick = onUpArrowBtn;

    this._restoreHandlers();

    console.log(this._state);
  }

  get template() {
    return createEditTemplate(this._state);
  }

  _restoreHandlers() {
    this.element
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#arrowBtnClickHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #arrowBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleArrowBtnClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      event: {
        ...this._state.event,
        type: evt.target.value,
        offers: []
      },
      typeOffers: [
        ...this.#getTypeOffers(capitalize(evt.target.value))
      ]
    });
  };
}
