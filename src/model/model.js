import {getRandomPoint} from '../mock/point.js';
import {mockDestinations} from '../mock/destinations.js';
import {mockOffers} from '../mock/offers.js';
import {POINT_COUNT, FilterType} from '../const.js';
import {isFuturedPoint, isPresentedPoint, isPastedPoint} from '../utils.js';

export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #destinations = mockDestinations;
  #offers = mockOffers;
  #filterModel = null;
  #observers = [];

  constructor({filterModel}) {
    this.#filterModel = filterModel;
  }

  get points() {
    const filterType = this.#filterModel?.filter || FilterType.EVERYTHING;

    switch (filterType) {
      case FilterType.FUTURE:
        return this.#points.filter((point) => isFuturedPoint(point));
      case FilterType.PRESENT:
        return this.#points.filter((point) => isPresentedPoint(point));
      case FilterType.PAST:
        return this.#points.filter((point) => isPastedPoint(point));
      case FilterType.EVERYTHING:
      default:
        return [...this.#points];
    }
  }

  get allPoints() {
    return [...this.#points];
  }

  set points(points) {
    this.#points = [...points];
  }

  get destinations() {
    return [...this.#destinations];
  }

  get offers() {
    return [...this.#offers];
  }

  getDestinationById(destinationId) {
    return this.#destinations.find(({id}) => id === destinationId);
  }

  getOffersByType(type) {
    const {offers} = this.#offers.find((offer) => offer.type === type) || {};
    return offers ? [...offers] : [];
  }

  getOfferById(offerId) {
    for (const {offers} of this.#offers) {
      const foundOffer = offers.find(({id}) => id === offerId);
      if (foundOffer) {
        return {...foundOffer};
      }
    }
    return null;
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    if (index === -1) {
      return;
    }

    this.#points = [
      ...this.#points.slice(0, index),
      {...this.#points[index], ...updatedPoint},
      ...this.#points.slice(index + 1)
    ];

    this.#notifyObservers();
  }

  deletePoint(pointId) {
    const initialLength = this.#points.length;
    this.#points = this.#points.filter((point) => point.id !== pointId);

    if (this.#points.length !== initialLength) {
      this.#notifyObservers();
    }
  }
}

