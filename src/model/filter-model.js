import {FilterType} from '../const';

export default class FilterModel {
  #filter = FilterType.EVERYTHING;
  #observers = [];

  get filter() {
    return this.#filter;
  }

  setFilter(filterType) {
    this.#filter = filterType;
    this.#notifyObservers();
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }
}
