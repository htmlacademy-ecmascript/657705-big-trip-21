export default class OffersModel {
  #eventsApiService = null;
  #offers = [];

  constructor(apiService) {
    this.#eventsApiService = apiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offers = await this.#eventsApiService.offers;
      this.#offers = offers;
    } catch (err) {
      this.#offers = [];
      throw new Error('Ошибка при загрузке данных');
    }
  }

  getByType(type) {
    return this.#offers.find((offer) => offer.type === type).offers;
  }
}
