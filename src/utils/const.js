const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT'
};

const RequestUrl = {
  EVENTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers'
};

export {
  UpdateType,
  UserAction,
  FilterType,
  SortType,
  Method,
  RequestUrl
};
