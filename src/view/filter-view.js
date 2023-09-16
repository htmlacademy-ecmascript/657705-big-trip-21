import { html } from '@src/utils/utils';
import AbstractView from '@src/framework/view/abstract-view';

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterChange = null;

  constructor({ filters, currentFilterType, onFilterChange }) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterChange = onFilterChange;

    this.element
      .addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return this.#createFilterTemplate();
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterChange(evt.target.value);
  };

  #createFilterTemplate() {
    return html`
      <form class="trip-filters" action="#" method="get">
        ${this.#filters.map((filter) => html`
          <div class="trip-filters__filter">
            <input
              id="filter-${filter.type}"
              class="trip-filters__filter-input  visually-hidden"
              type="radio"
              name="trip-filter"
              value="${filter.type}"
              ${filter.type === this.#currentFilter ? 'checked' : ''}
              ${filter.count === 0 ? 'disabled' : ''}
            >
            <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
          </div>
        `)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }
}
