import AbstractView from '@src/framework/view/abstract-view';
import { createEventTemplate } from '@src/template/event-template';

export default class EventView extends AbstractView {
  constructor({ event, eventDestination, typeOffers }) {
    super();

    this.event = event;
    this.eventDestination = eventDestination;
    this.typeOffers = typeOffers;
  }

  get template() {
    return createEventTemplate({
      event: this.event,
      eventDestination: this.eventDestination,
      typeOffers: this.typeOffers
    });
  }
}
