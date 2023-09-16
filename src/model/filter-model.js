import Observable from '@src/framework/observable';
import { FilterType } from '@src/utils/const';

export default class FilterModel extends Observable {
  #currentFilter = FilterType.EVERYTHING;

  get filter() {
    return this.#currentFilter;
  }

  setFilter(updateType, filter) {
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  }
}
