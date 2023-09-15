
import Observable from '@src/framework/observable';
import { UpdateType } from '@src/utils/const';

export default class EventsModel extends Observable {
  #events = [];
  #eventsApiService = null;

  constructor(apiService) {
    super();

    this.#eventsApiService = apiService;
  }

  get events() {
    return this.#events;
  }

  //TODO: Зачем вынесли в init? Вернуть в конструктор?

  async init() {
    try {
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptToClient);
    } catch (err) {
      this.#events = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Низя обновить несуществующий маршрут');
    }

    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response);

      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1)
      ];

      this._notify(updateType, update);
    } catch (err) {
      // console.log(err);
      throw new Error('Не получилось обновить точку маршрута');
    }
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const newEvent = this.#adaptToClient(response);

      this.#events = [
        newEvent,
        ...this.#events
      ];

      this._notify(updateType, update);

    } catch (err) {
      throw new Error('Не получилось добавить точку маршрута');
    }
  }

  async deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Низя удалить несуществующий маршрут');
    }

    try {
      await this.#eventsApiService.deleteEvent(update);

      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1)
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Не получилось удалить точку маршрута');
    }
  }

  #adaptToClient(event) {
    const adaptedEvent = {
      ...event,
      basePrice: event['base_price'],
      dateFrom: new Date(event['date_from']),
      dateTo: new Date(event['date_to']),
      isFavorite: event['is_favorite']
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }
}
