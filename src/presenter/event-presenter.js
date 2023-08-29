import { remove, render, replace } from '@src/framework/render';

import EventView from '@src/view/event-view';
import EditView from '@src/view/edit-view';

export default class EventPresenter {
  #eventContainer = null;
  #handleDataChange = null;

  #eventComponent = null;
  #editEventComponent = null;

  #eventData = null;

  constructor({ eventContainer, onDataChange }) {
    this.#eventContainer = eventContainer;
    this.#handleDataChange = onDataChange;
  }

  init(eventData) {
    this.#eventData = eventData;

    const prevEventComponent = this.#eventComponent;
    const prevEditEventComponent = this.#editEventComponent;

    this.#eventComponent = new EventView({
      ...this.#eventData,
      onDownArrowBtn: this.#onDownArrowtBtn,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editEventComponent = new EditView({
      ...this.#eventData,
      onFormSubmit: this.#onFormSubmit,
      onUpArrowBtn: this.#onUpArrowBtn
    });

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this.#eventComponent, this.#eventContainer);
      return;
    }

    if (this.#eventContainer.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventContainer.contains(prevEditEventComponent.element)) {
      replace(this.#editEventComponent, prevEditEventComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#editEventComponent);
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

  #handleFavoriteClick = () => {

    const changedData = { ...this.#eventData };
    changedData.event.isFavorite = !changedData.event.isFavorite;

    this.#handleDataChange(changedData);
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#showEventComponent();
    }
  };
}
