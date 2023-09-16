import ApiService from '@src/framework/api-service';
import { Method, RequestUrl } from '@src/utils/const';

export default class EventsApiService extends ApiService {
  get events() {
    return this.#getData(RequestUrl.EVENTS);
  }

  get destinations() {
    return this.#getData(RequestUrl.DESTINATIONS);
  }

  get offers() {
    return this.#getData(RequestUrl.OFFERS);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `${RequestUrl.EVENTS}/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addEvent(event) {
    const response = await this._load({
      url: RequestUrl.EVENTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deleteEvent(event) {
    const response = await this._load({
      url: `${RequestUrl.EVENTS}/${event.id}`,
      method: Method.DELETE
    });

    return response;
  }

  async #getData(url) {
    const response = await this._load({ url });

    return ApiService.parseResponse(response);
  }

  #adaptToServer(event) {
    const adaptedEvent = {
      ...event,
      'base_price': +event.basePrice,
      'date_from': event.dateFrom.toISOString(),
      'date_to': event.dateTo.toISOString(),
      'is_favorite': event.isFavorite
    };

    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
