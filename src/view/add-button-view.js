import { html } from '@src/utils/utils';
import AbstractView from '@src/framework/view/abstract-view';

export default class AddButtonView extends AbstractView {
  #handleClick = null;

  constructor({ onClick }) {
    super();

    this.#handleClick = onClick;
    this.element
      .addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  get template() {
    return this.#createAddButtonTemplate();
  }

  #createAddButtonTemplate() {
    return html`
      <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
    `;
  }
}
