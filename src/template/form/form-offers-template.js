import { getSelectedOffers } from '@src/utils';

function createFormOffer(selectedOffers, typeOffers) {
  return typeOffers.map((offer) => /* html */ `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${offer.id}-1"
        type="checkbox"
        name="event-offer-${offer.id}"
        ${(selectedOffers.find((selectedOffer) => selectedOffer.id === offer.id)) ? 'checked' : ''}
      >
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');
}

export function createFormOffersTemplate(eventOffers, typeOffers) {
  const selectedOffers = getSelectedOffers(eventOffers, typeOffers);

  return /* html */ `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createFormOffer(selectedOffers, typeOffers)}
      </div>
    </section>
  `;
}
