import { RenderPosition, remove, render } from '@src/framework/render';
import { UserAction, UpdateType } from '@src/utils/const';
import EditView from '@src/view/edit-view';

export default class AddEventPresenter {
  #tripListComponent = null;
  #tripListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #destinationsModel = null;
  #offersModel = null;

  #editEventComponent = null;

  #defaultType = 'flight';
  #defaultEvent = {
    basePrice: 0,
    dateFrom: undefined,
    dateTo: undefined,
    destination: undefined,
    isFavorite: false,
    offers: [],
    type: this.#defaultType
  };

  constructor({ tripListComponent, tripListContainer, onDataChange, onDestroy, destinationsModel, offersModel }) {
    this.#tripListComponent = tripListComponent;
    this.#tripListContainer = tripListContainer;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#editEventComponent !== null) {
      return;
    }

    const defaultEvent = {
      event: {
        ...this.#defaultEvent
      },
      eventDestination: {},
      typeOffers: this.#offersModel.getByType(this.#defaultType)
    };

    const allTypes = this.#offersModel.get().map((offer) => offer.type);
    const allDestinations = this.#destinationsModel.get().map((destination) => ({
      id: destination.id,
      name: destination.name
    }));

    this.#editEventComponent = new EditView({
      data: this.#parseEventToState(defaultEvent),
      allTypes,
      allDestinations,

      getTypeOffers: this.#getTypeOffers,
      getDestination: this.#getDestination,

      onFormSubmit: this.#handleFormSubmit,
      onDeleteBtn: this.destroy,

      isEdit: false
    });

    if (!document.querySelector('.trip-events__list')) {
      render(this.#tripListComponent, this.#tripListContainer, RenderPosition.AFTERBEGIN);
    }

    render(this.#editEventComponent, this.#tripListComponent.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#editEventComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editEventComponent);
    this.#editEventComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (state) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      this.#parseStateToEvent({
        id: crypto.randomUUID(),
        ...state
      })
    );

    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #getTypeOffers = (type) => this.#offersModel.getByType(type);

  #getDestination = (id) => this.#destinationsModel.getById(id);

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
      }))
    };
  }

  #parseStateToEvent(state) {
    const event = { ...state };

    event.destination = event.destination.id;
    event.offers = event.offers.filter((offer) => offer.isSelected).map((offer) => offer.id);

    return event;
  }
}
