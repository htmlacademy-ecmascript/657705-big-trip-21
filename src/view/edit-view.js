import AbstractView from '@src/framework/view/abstract-view';
import { createEditTemplate } from '@src/template/form/form-template';

export default class EditView extends AbstractView {
  #event = {};
  #eventDestination = {};
  #typeOffers = [];
  #handleFormSubmit = null;

  constructor({ event, eventDestination, typeOffers, onFormSubmit }) {
    super();

    this.#event = event;
    this.#eventDestination = eventDestination;
    this.#typeOffers = typeOffers;

    this.#handleFormSubmit = onFormSubmit;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditTemplate({
      event: this.#event,
      eventDestination: this.#eventDestination,
      typeOffers: this.#typeOffers
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
