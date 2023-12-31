import { RenderPosition, remove, render } from '@src/framework/render';
import { UserAction, UpdateType, FilterType, SortType } from '@src/utils/const';
import { filter } from '@src/utils/filter';
import { sortByDaysInDescOrder, sortDurationTimeInDescOrder, sortPriceInDescOrder } from '@src/utils/sort';
import UiBlocker from '@src/framework/ui-blocker/ui-blocker';

import EventPresenter from './event-presenter';
import AddEventPresenter from './add-event-presenter';

import SortView from '@src/view/sort-view';
import TripListView from '@src/view/trip-list-view';
import NoEventView from '@src/view/no-event-view';
import LoadingView from '@src/view/loading-view';
import FailedView from '@src/view/failed-view';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripListPresenter {
  #tripListComponent = new TripListView();
  #loadingComponent = new LoadingView();
  #failedComponent = new FailedView();
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
  #isFailed = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
    render(this.#tripListComponent, this.#tripListContainer);
  }

  addEvent() {
    this.#sortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.events.length === 0) {
      remove(this.#noEventComponent);
      this.#renderSort();
    }

    this.#addEventPresenter.init();
  }

  closeAddEvent() {
    if (this.events.length === 0) {
      remove(this.#sortComponent);
      this.#renderNoEvent();
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripListContainer, RenderPosition.BEFOREEND);
  }

  #renderFailed() {
    render(this.#failedComponent, this.#tripListContainer, RenderPosition.BEFOREEND);
  }

  #renderEventList() {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isFailed) {
      this.#renderFailed();
      return;
    }

    if (this.events.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();

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

    render(this.#sortComponent, this.#tripListContainer, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#sortType === sortType) {
      return;
    }

    this.#sortType = sortType;
    this.#clearEventList();
    this.#renderEventList();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {

      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_EVENT:
        this.#addEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch (err) {
          this.#addEventPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

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
        this.#isFailed = false;
        remove(this.#loadingComponent);
        remove(this.#failedComponent);
        this.#renderEventList();
        break;
      case UpdateType.FAILED:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderEventList();
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
