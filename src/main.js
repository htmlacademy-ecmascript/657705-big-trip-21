import { render, RenderPosition } from './framework/render';

import MockService from '@src/service/mock-service';
import DestinationsModel from '@src/model/destinations-model';
import OffersModel from '@src/model/offers-model';
import EventsModel from '@src/model/events-model';

import FilterView from '@src/view/filter-view';
import TripListPresenter from '@src/presenter/trip-list-presenter';
import InfoPresenter from './presenter/info-presenter';

const headerNode = document.querySelector('.page-header');
const headerFilterNode = headerNode.querySelector('.trip-controls__filters');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const eventsModel = new EventsModel(mockService);

render(new FilterView(), headerFilterNode);

new InfoPresenter({ destinationsModel, eventsModel }).init();
new TripListPresenter({ destinationsModel, offersModel, eventsModel }).init();
