import { render } from '@src/render';

import SortView from '@src/view/sort-view';
import TripListView from '@src/view/trip-list-view';
import EditView from '@src/view/edit-view';
import EventView from '@src/view/event-view';

export default class TripListPresenter {
  tripListComponent = new TripListView();
  tripListContainer = document.querySelector('.trip-events');

  init() {
    render(new SortView(), this.tripListContainer);
    render(this.tripListComponent, this.tripListContainer);
    render(new EditView(), this.tripListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.tripListComponent.getElement());
    }
  }
}
