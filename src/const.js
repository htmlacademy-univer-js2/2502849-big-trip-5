export const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST'
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const EmptyListText = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now'
};

export const DATE_FORMAT = 'd/m/y H:i';
export const FORMAT_TIME = 'HH:mm';
export const FORMAT_DAY = 'MMM D';
export const FORMAT_DATETIME = 'DD/MM/YY HH:mm';

export const FLATPICKR_COMMON_OPTIONS = {
  dateFormat: DATE_FORMAT,
  enableTime: true,
  // eslint-disable-next-line camelcase
  time_24hr: true,
  locale: {firstDayOfWeek: 1},
  allowInput: true
};

export const BASE_URL = 'https://24.objects.htmlacademy.pro/big-trip';

export const AUTHORIZATION = 'Basic er883jdzbdw';

export const HttpMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};
