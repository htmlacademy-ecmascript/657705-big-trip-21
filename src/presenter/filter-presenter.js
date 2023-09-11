import { render } from '@src/framework/render';
import FilterView from '@src/view/filter-view';

export default class FilterPresenter {
  #filterContainer = document.querySelector('.page-header .trip-controls__filters');

  init() {
    render(new FilterView(), this.#filterContainer);
  }
}
