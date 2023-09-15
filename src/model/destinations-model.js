export default class DestinationsModel {
  #eventsApiService = null;
  #destinations = [];

  constructor(apiService) {
    this.#eventsApiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const destinations = await this.#eventsApiService.destinations;
      this.#destinations = destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }

  getById(id) {
    return this.#destinations.find((destionation) => destionation.id === id);
  }
}
