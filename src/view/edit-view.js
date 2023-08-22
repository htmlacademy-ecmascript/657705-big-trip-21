import AbstractView from '@src/framework/view/abstract-view';
import { createEditTemplate } from '@src/template/form/form-template';

export default class EditView extends AbstractView {
  constructor({ event, eventDestination, typeOffers }) {
    super();

    this.event = event;
    this.eventDestination = eventDestination;
    this.typeOffers = typeOffers;
  }

  get template() {
    return createEditTemplate({
      event: this.event,
      eventDestination: this.eventDestination,
      typeOffers: this.typeOffers
    });
  }
}
