import { createElement } from '@src/render';

const tripListTemplate = '<ul class="trip-events__list"></ul>';

export default class TripListView {
  getTemplate() {
    return tripListTemplate;
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
