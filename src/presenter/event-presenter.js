import { render, replace } from '@src/framework/render';

import EventView from '@src/view/event-view';
import EditView from '@src/view/edit-view';

export default class EventPresenter {
  #eventContainer = null;

  #eventComponent = null;
  #editEventComponent = null;

  #eventData = null;

  constructor({ eventContainer }) {
    this.#eventContainer = eventContainer;
  }

  init(eventData) {
    this.#eventData = eventData;

    this.#eventComponent = new EventView({
      ...this.#eventData,
      onDownArrowBtn: this.#onDownArrowtBtn
    });

    this.#editEventComponent = new EditView({
      ...this.#eventData,
      onFormSubmit: this.#onFormSubmit,
      onUpArrowBtn: this.#onUpArrowBtn
    });

    render(this.#eventComponent, this.#eventContainer);
  }

  #showEventComponent() {
    replace(this.#eventComponent, this.#editEventComponent);
    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  #showEditComponent() {
    replace(this.#editEventComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #onDownArrowtBtn = () => {
    this.#showEditComponent();
  };

  #onFormSubmit = () => {
    this.#showEventComponent();
  };

  #onUpArrowBtn = () => {
    this.#showEventComponent();
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#showEventComponent();
    }
  };
}
