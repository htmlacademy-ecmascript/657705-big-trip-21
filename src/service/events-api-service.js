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
      url: RequestUrl.EVENTS,
      method: Method.PUT,
      body: JSON.stringify(event),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async #getData(url) {
    const response = await this._load({ url });

    return ApiService.parseResponse(response);
  }
}
