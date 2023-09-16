import AbstractView from '@src/framework/view/abstract-view';

const failedTemplate = '<p class="trip-events__msg">Failed to load latest route information</p>';

export default class FailedView extends AbstractView {
  get template() {
    return failedTemplate;
  }
}
