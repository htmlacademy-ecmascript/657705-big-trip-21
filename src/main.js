import { RenderPosition, render } from './framework/render';

import MockService from '@src/service/mock-service';
import DestinationsModel from '@src/model/destinations-model';
import OffersModel from '@src/model/offers-model';
import EventsModel from '@src/model/events-model';
import FilterModel from './model/filter-model';

import FilterPresenter from './presenter/filter-presenter';
import TripListPresenter from '@src/presenter/trip-list-presenter';
import InfoPresenter from './presenter/info-presenter';

import AddButtonView from './view/add-button-view';

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const eventsModel = new EventsModel(mockService);
const filterModel = new FilterModel();

new FilterPresenter({ filterModel, eventsModel }).init();
new InfoPresenter({ destinationsModel, eventsModel }).init();

const tripListPresenter = new TripListPresenter({
  destinationsModel,
  offersModel,
  eventsModel,
  filterModel,
  onAddEventDestroy: handleAddEventClose
});
tripListPresenter.init();

const addButtonComponent = new AddButtonView({
  onClick: handleAddButtonClick
});

function handleAddButtonClick() {
  tripListPresenter.addEvent();
  addButtonComponent.element.disabled = true;
}

function handleAddEventClose() {
  addButtonComponent.element.disabled = false;
}

render(addButtonComponent, document.querySelector('.trip-main'), RenderPosition.BEFOREEND);
