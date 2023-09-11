import MockService from '@src/service/mock-service';
import DestinationsModel from '@src/model/destinations-model';
import OffersModel from '@src/model/offers-model';
import EventsModel from '@src/model/events-model';

import FilterPresenter from './presenter/filter-presenter';
import TripListPresenter from '@src/presenter/trip-list-presenter';
import InfoPresenter from './presenter/info-presenter';

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const eventsModel = new EventsModel(mockService);

new FilterPresenter().init();
new InfoPresenter({ destinationsModel, eventsModel }).init();
new TripListPresenter({ destinationsModel, offersModel, eventsModel }).init();
