import { createElement } from '@src/render';
import { createEventTemplate } from '@src/template/event-template';

export default class EventView {
  constructor({ event, eventDestination, typeOffers }) {
    this.event = event;
    this.eventDestination = eventDestination;
    this.typeOffers = typeOffers;
  }

  getTemplate() {
    return createEventTemplate({
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
