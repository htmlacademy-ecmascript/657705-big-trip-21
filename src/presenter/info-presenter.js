import { render, RenderPosition } from '@src/framework/render';
import InfoView from '@src/view/info-view';

export default class InfoPresenter {
  #headerInfoContainer = document.querySelector('.trip-main');

  #destinations = [];
  #events = [];

  constructor({ destinationsModel, eventsModel }) {
    this.#destinations = destinationsModel.get();
    this.#events = eventsModel.get();
  }

  init() {
    render(
      new InfoView({
        destinations: this.#destinations,
        events: this.#events
      }),
      this.#headerInfoContainer, RenderPosition.AFTERBEGIN
    );
  }
}
