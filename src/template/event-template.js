import { getSelectedOffers, humanizeEventDate, humanizeEventDiffenceTime, humanizeEventTime } from '@src/utils';

function createOffersTemplate(eventOffers) {
  const offers = eventOffers.map((offer) =>
    /* html */ `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        +€&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `
  ).join('');

  return /* html */ `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers}
    </ul>
  `;
}

export function createEventTemplate({ event, eventDestination, typeOffers }) {

  const eventDate = humanizeEventDate(event.dateFrom);
  const timeFrom = humanizeEventTime(event.dateFrom);
  const timeTo = humanizeEventTime(event.dateTo);
  const timeDuration = humanizeEventDiffenceTime(event.dateFrom, event.dateTo);

  const selectedOffers = getSelectedOffers(event.offers, typeOffers);

  return /* html */ `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.type} ${eventDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T12:25">${timeFrom}</time>
            —
            <time class="event__end-time" datetime="2019-03-18T13:35">${timeTo}</time>
          </p>
          <p class="event__duration">${timeDuration}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${event.basePrice}</span>
        </p>
        ${selectedOffers.length !== 0 ? createOffersTemplate(selectedOffers) : ''}
        <button class="event__favorite-btn ${(event.isFavorite) ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}
