import { createElement } from '@src/render';
import { createEditTemplate } from '@src/template/form/form-template';
export default class EditView {
  constructor({ event, eventDestination, typeOffers }) {
    this.event = event;
    this.eventDestination = eventDestination;
    this.typeOffers = typeOffers;
  }

  getTemplate() {
    return createEditTemplate({
      event: this.event,
      eventDestination: this.eventDestination,
      typeOffers: this.typeOffers
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
