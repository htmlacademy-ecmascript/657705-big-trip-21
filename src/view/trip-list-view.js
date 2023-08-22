import AbstractView from '@src/framework/view/abstract-view';

const tripListTemplate = '<ul class="trip-events__list"></ul>';

export default class TripListView extends AbstractView {
  get template() {
    return tripListTemplate;
  }
}
