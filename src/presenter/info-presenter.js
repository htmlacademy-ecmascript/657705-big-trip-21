import { remove, render, RenderPosition, replace } from '@src/framework/render';
import { sortByDaysInDescOrder } from '@src/utils/sort';
import InfoView from '@src/view/info-view';

export default class InfoPresenter {
  #headerInfoContainer = document.querySelector('.trip-main');

  #infoComponent = null;

  #eventsModel = [];
  #destinationsModel = [];
  #offersModel = [];

  constructor({ destinationsModel, eventsModel, offersModel }) {
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {

    if (this.#eventsModel.events.length === 0) {
      remove(this.#infoComponent);
      this.#infoComponent = null;
      return;
    }

    const prevInfoComponent = this.#infoComponent;
    const events = [...this.#eventsModel.events];

    this.#infoComponent = new InfoView({
      data: {
        ...this.#getTripInfo(events),
        price: this.#getTripPrice(events),
        length: events.length
      }
    });

    if (prevInfoComponent === null) {
      render(this.#infoComponent, this.#headerInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #getTripInfo(events) {
    const sortedEvents = [...events.sort(sortByDaysInDescOrder)];

    if (sortedEvents.length > 3) {
      sortedEvents.splice(1, sortedEvents.length - 2);
    }

    return {
      date: {
        from: sortedEvents[0].dateFrom,
        to: sortedEvents[sortedEvents.length - 1].dateTo
      },
      destinations: sortedEvents.map((event) => this.#destinationsModel.getById(event.destination).name)
    };
  }

  #getTripPrice(events) {
    return [...events].reduce((acc, current) => {
      let price = current.basePrice;

      if (current.offers.length !== 0) {
        const offers = this.#offersModel.getByType(current.type);
        const offersPrice = offers
          .map((offer) => {
            if (current.offers.includes(offer.id)) {
              return offer.price;
            }
          })
          .filter((item) => item !== undefined);

        price = offersPrice.reduce((accPrice, currentPrice) => accPrice + currentPrice, 0) + current.basePrice;
      }

      return acc + price;

    }, 0);
  }
}
