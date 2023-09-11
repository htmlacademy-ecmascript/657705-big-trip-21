import { remove, render } from '@src/framework/render';
import { UserAction, UpdateType, FilterType } from '@src/utils/const';
import { filter } from '@src/utils/filter';

import EventPresenter from './event-presenter';

import SortView from '@src/view/sort-view';
import TripListView from '@src/view/trip-list-view';
import NoEventView from '@src/view/no-event-view';

export default class TripListPresenter {
  #tripListComponent = new TripListView();
  #tripListContainer = document.querySelector('.trip-events');
  #sortComponent = null;
  #noEventComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;
  #filterModel = null;

  #eventPresenters = new Map();
  #filterType = FilterType.EVERYTHING;

  constructor({ destinationsModel, offersModel, eventsModel, filterModel }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderEventList();
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;

    const filteredTasks = filter[this.#filterType](events);

    return filteredTasks;

  }

  #renderEventList() {

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
    this.#sortComponent = new SortView();
    render(this.#sortComponent, this.#tripListContainer);
  }

  #handleViewAction = (actionType, updateType, update) => {

    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные

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

    // В зависимости от типа изменений решаем, что делать:

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearEventList();
        this.#renderEventList();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearEventList();
        this.#renderEventList();
        break;
    }
  };

  #clearEventList() {
    this.#eventPresenters.forEach((event) => event.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noEventComponent);
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
