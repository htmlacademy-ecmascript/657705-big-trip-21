import AbstractView from '@src/framework/view/abstract-view';

const loadingTemplate = '<p class="trip-events__msg">Loading...</p>';

export default class LoadingView extends AbstractView {
  get template() {
    return loadingTemplate;
  }
}
