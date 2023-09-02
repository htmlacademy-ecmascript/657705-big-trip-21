import { TYPES } from '@src/mock/const';

export function createFormTypesTemplate(eventType) {
  return TYPES.map((type) => {
    const lowerCaseType = type.toLowerCase();
    const lowerCaseEventType = eventType.toLowerCase();

    return /*html */ `
      <div class="event__type-item">
        <input
        id="event-type-${lowerCaseType}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${lowerCaseType}"
        ${(lowerCaseType === lowerCaseEventType) ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${lowerCaseType}" for="event-type-${lowerCaseType}-1">${type}</label>
      </div>
    `;
  }).join('');
}
