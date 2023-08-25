import AbstractView from '@src/framework/view/abstract-view';

const noEventTemplate = '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class NoEventView extends AbstractView {
  get template() {
    return noEventTemplate;
  }
}
