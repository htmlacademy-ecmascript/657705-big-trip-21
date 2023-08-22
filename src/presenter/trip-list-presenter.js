import { render } from '@src/framework/render';

import SortView from '@src/view/sort-view';
import TripListView from '@src/view/trip-list-view';
import EditView from '@src/view/edit-view';
import EventView from '@src/view/event-view';

export default class TripListPresenter {
  tripListComponent = new TripListView();
  tripListContainer = document.querySelector('.trip-events');

  constructor({ destinationsModel, offersModel, eventsModel }) {
    this.destinations = destinationsModel;
    this.offers = offersModel;
    this.events = eventsModel.get();
  }

  init() {
    render(new SortView(), this.tripListContainer);
    render(this.tripListComponent, this.tripListContainer);
    render(
      new EditView({
        event: this.events[0],
        eventDestination: this.destinations.getById(this.events[0].destination),
        typeOffers: this.offers.getByType(this.events[0].type)
      }),
      this.tripListComponent.element
    );

    this.events.forEach((event) => {
      render(
        new EventView({
          event,
          eventDestination: this.destinations.getById(event.destination),
          typeOffers: this.offers.getByType(event.type)
        }),
        this.tripListComponent.element
      );
    });
  }
}
