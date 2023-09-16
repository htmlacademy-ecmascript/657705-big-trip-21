import { SortType } from '@src/utils/const';
import AbstractView from '@src/framework/view/abstract-view';
import { html } from '@src/utils/utils';

export default class SortView extends AbstractView {
  #sortType = null;
  #handleSortTypeChange = null;

  constructor({ sortType, onSortTypeChange }) {
    super();

    this.#sortType = sortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element
      .addEventListener('click', this.#sortTypeChangeHandler);
  }

  //TODO: Клики идут по всем, доделать

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.classList.contains('trip-sort__btn')) {
      return;
    }

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

  get template() {
    return this.#createSortTemplate();
  }

  #createSortTemplate() {
    const availableSortTypes = [SortType.DAY, SortType.TIME, SortType.PRICE];

    return html`
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${Object.values(SortType).map((type) => html`
          <div class="trip-sort__item  trip-sort__item--${type}">
            <input
              id="sort-${type}"
              class="trip-sort__input  visually-hidden"
              type="radio"
              name="trip-sort"
              value="sort-${type}"
              ${availableSortTypes.includes(type) ? '' : 'disabled'}
              ${this.#sortType === type ? 'checked' : ''}
            >
            <label
              class="trip-sort__btn"
              for="sort-${type}"
              data-sort-type="${type}"
            >
              ${type}
            </label>
          </div>
        `)}
      </form>
    `;
  }
}
