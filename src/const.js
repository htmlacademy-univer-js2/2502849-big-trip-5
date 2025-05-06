export const POINT_COUNT = 4;

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
