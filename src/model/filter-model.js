export default class FilterModel {
  #currentFilter = null;

  constructor(filter) {
    this.#currentFilter = filter;
  }

  get filter() {
    return this.#currentFilter;
  }
}
