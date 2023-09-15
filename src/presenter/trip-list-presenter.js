import { RenderPosition, remove, render } from '@src/framework/render';
import { UserAction, UpdateType, FilterType, SortType } from '@src/utils/const';
import { filter } from '@src/utils/filter';
import { sortByDaysInDescOrder, sortDurationTimeInDescOrder, sortPriceInDescOrder } from '@src/utils/sort';

import EventPresenter from './event-presenter';
import AddEventPresenter from './add-event-presenter';

import SortView from '@src/view/sort-view';
import TripListView from '@src/view/trip-list-view';
import NoEventView from '@src/view/no-event-view';
import LoadingView from '@src/view/loading-view';

export default class TripListPresenter {
  #tripListComponent = new TripListView();
  #loadingComponent = new LoadingView();
  #tripListContainer = document.querySelector('.trip-events');
  #sortComponent = null;
  #noEventComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;
  #filterModel = null;

  #eventPresenters = new Map();
  #addEventPresenter = null;

  #filterType = FilterType.EVERYTHING;
  #sortType = SortType.DAY;
  #isLoading = true;

  constructor({ destinationsModel, offersModel, eventsModel, filterModel, onAddEventDestroy }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#addEventPresenter = new AddEventPresenter({
      tripListComponent: this.#tripListComponent,
      tripListContainer: this.#tripListContainer,

      onDataChange: this.#handleViewAction,
      onDestroy: onAddEventDestroy,

      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;

    const filteredEvents = filter[this.#filterType](events);

    switch (this.#sortType) {
      case SortType.PRICE:
        return filteredEvents.sort(sortPriceInDescOrder);
      case SortType.TIME:
        return filteredEvents.sort(sortDurationTimeInDescOrder);
    }

    return filteredEvents.sort(sortByDaysInDescOrder);
  }

  init() {
    this.#renderEventList();
  }

  addEvent() {
    this.#sortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#addEventPresenter.init();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripListContainer, RenderPosition.BEFOREEND);
  }

  #renderEventList() {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.events.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();

    render(this.#tripListComponent, this.#tripListContainer);
    this.events.forEach(this.#renderEvent);
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter({
      eventContainer: this.#tripListComponent.element,

      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,

      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  };

  #renderNoEvent() {
    this.#noEventComponent = new NoEventView({
      filterType: this.#filterType
    });

    render(this.#noEventComponent, this.#tripListContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      sortType: this.#sortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripListContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#sortType === sortType) {
      return;
    }

    this.#sortType = sortType;
    this.#clearEventList();
    this.#renderEventList();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  //TODO: 7.6 оптимизация, не забыть!

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventList();
        this.#renderEventList();
        break;
      case UpdateType.MAJOR:
        this.#clearEventList({ resetSortType: true });
        this.#renderEventList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderEventList();
        break;
    }
  };

  #clearEventList({ resetSortType = false } = {}) {
    this.#addEventPresenter.destroy();
    this.#eventPresenters.forEach((event) => event.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noEventComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#sortType = SortType.DAY;
    }
  }

  #handleModeChange = () => {
    this.#addEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
