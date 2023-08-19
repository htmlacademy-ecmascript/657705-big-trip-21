import { render, RenderPosition } from '@src/render';

import MockService from '@src/service/mock-service';
import DestinationsModel from '@src/model/destinations-model';
import OffersModel from '@src/model/offers-model';
import EventsModel from '@src/model/events-model';

import FilterView from '@src/view/filter-view';
import InfoView from '@src/view/info-view';
import TripListPresenter from '@src/presenter/trip-list-presenter';

const headerNode = document.querySelector('.page-header');
const headerInfoNode = headerNode.querySelector('.trip-main');
const headerFilterNode = headerNode.querySelector('.trip-controls__filters');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const eventsModel = new EventsModel(mockService);

render(new InfoView(), headerInfoNode, RenderPosition.AFTERBEGIN);
render(new FilterView(), headerFilterNode);

new TripListPresenter({ destinationsModel, offersModel, eventsModel }).init();
