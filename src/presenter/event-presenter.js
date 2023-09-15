import { remove, render, replace } from '@src/framework/render';
import { UserAction, UpdateType } from '@src/utils/const';

import EventView from '@src/view/event-view';
import EditView from '@src/view/edit-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class EventPresenter {
  #event = null;
  #eventContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #eventComponent = null;
  #editEventComponent = null;

  #destinationsModel = null;
  #offersModel = null;

  #mode = Mode.DEFAULT;

  constructor({ eventContainer, destinationsModel, offersModel, onDataChange, onModeChange }) {
    this.#eventContainer = eventContainer;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(event) {

    this.#event = {
      event,
      eventDestination: this.#destinationsModel.getById(event.destination),
      typeOffers: this.#offersModel.getByType(event.type),
    };

    const allTypes = this.#offersModel.offers.map((offer) => offer.type);
    const allDestinations = this.#destinationsModel.destinations.map((destination) => ({
      id: destination.id,
      name: destination.name
    }));

    const prevEventComponent = this.#eventComponent;
    const prevEditEventComponent = this.#editEventComponent;

    this.#eventComponent = new EventView({
      data: this.#parseEventToState(this.#event),
      onDownArrowBtn: this.#onDownArrowtBtn,
      onFavoriteBtn: this.#onFavoriteBtn
    });

    this.#editEventComponent = new EditView({
      data: this.#parseEventToState(this.#event),
      allTypes,
      allDestinations,

      getTypeOffers: this.#getTypeOffers,
      getDestination: this.#getDestination,

      onFormSubmit: this.#onFormSubmit,
      onUpArrowBtn: this.#onUpArrowBtn,
      onDeleteBtn: this.#onDeleteBtn
    });

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this.#eventComponent, this.#eventContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventComponent, prevEventComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#editEventComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editEventComponent.reset(this.#parseEventToState(this.#event));
      this.#showEventComponent();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editEventComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editEventComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editEventComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#editEventComponent.shake(resetFormState);
  }

  #showEventComponent() {
    replace(this.#eventComponent, this.#editEventComponent);
    document.removeEventListener('keydown', this.#escKeydownHandler);

    this.#mode = Mode.DEFAULT;
  }

  #showEditComponent() {
    replace(this.#editEventComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeydownHandler);

    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #getTypeOffers = (type) => this.#offersModel.getByType(type);

  #getDestination = (id) => this.#destinationsModel.getById(id);

  /**
   * Handlers
   */

  #onDownArrowtBtn = () => {
    this.#showEditComponent();
  };

  #onFormSubmit = (state) => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      this.#parseStateToEvent(state)
    );
  };

  #onUpArrowBtn = () => {
    this.#editEventComponent.reset(this.#parseEventToState(this.#event));
    this.#showEventComponent();
  };

  #onFavoriteBtn = (state) => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      this.#parseStateToEvent(state)
    );
  };

  #onDeleteBtn = (state) => {
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      this.#parseStateToEvent(state)
    );
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editEventComponent.reset(this.#parseEventToState(this.#event));
      this.#showEventComponent();
    }
  };

  /**
   * State
   */

  #parseEventToState({ event, eventDestination, typeOffers }) {
    return {
      ...event,
      destination: {
        ...eventDestination
      },
      offers: typeOffers.map((offer) => ({
        ...offer,
        isSelected: event.offers.includes(offer.id)
      })),

      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  #parseStateToEvent(state) {
    const event = { ...state };

    event.destination = event.destination.id;
    event.offers = event.offers.filter((offer) => offer.isSelected).map((offer) => offer.id);

    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;

    return event;
  }
}
