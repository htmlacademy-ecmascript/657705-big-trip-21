import { render } from '@src/framework/render';
import { UserAction, UpdateType } from '@src/utils/const';

import EventPresenter from './event-presenter';

import SortView from '@src/view/sort-view';
import TripListView from '@src/view/trip-list-view';
import NoEventView from '@src/view/no-event-view';

export default class TripListPresenter {
  #tripListComponent = new TripListView();
  #tripListContainer = document.querySelector('.trip-events');

  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;

  #eventPresenters = new Map();

  constructor({ destinationsModel, offersModel, eventsModel }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {

    if (this.events.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
  }

  get events() {
    return this.#eventsModel.events;
  }

  #renderEventList() {
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
    render(new NoEventView(), this.#tripListContainer);
  }

  #renderSort() {
    render(new SortView(), this.#tripListContainer);
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
        break;
    }
  };

  #clearEventList() {
    this.#eventPresenters.forEach((event) => event.destroy());
    this.#eventPresenters.clear();
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
