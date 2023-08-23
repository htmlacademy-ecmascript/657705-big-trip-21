import { render, replace } from '@src/framework/render';

import SortView from '@src/view/sort-view';
import TripListView from '@src/view/trip-list-view';
import EditView from '@src/view/edit-view';
import EventView from '@src/view/event-view';

export default class TripListPresenter {
  #tripListComponent = new TripListView();
  #tripListContainer = document.querySelector('.trip-events');

  #destinations = null;
  #offers = null;
  #events = [];

  constructor({ destinationsModel, offersModel, eventsModel }) {
    this.#destinations = destinationsModel;
    this.#offers = offersModel;
    this.#events = eventsModel.get();
  }

  init() {
    render(new SortView(), this.#tripListContainer);
    render(this.#tripListComponent, this.#tripListContainer);

    this.#events.forEach(this.#renderEvent);
  }

  #renderEvent = (event) => {
    const eventData = {
      event,
      eventDestination: this.#destinations.getById(event.destination),
      typeOffers: this.#offers.getByType(event.type),
    };

    const eventComponent = new EventView({
      ...eventData,
      onEditClick
    });

    const editEventComponent = new EditView({
      ...eventData,
      onFormSubmit
    });

    function onEditClick() {
      showEditComponent();
    }

    function onFormSubmit() {
      showEventComponent();
    }

    function showEditComponent() {
      replace(editEventComponent, eventComponent);
    }

    function showEventComponent() {
      replace(eventComponent, editEventComponent);
    }

    render(eventComponent, this.#tripListComponent.element);
  };
}
