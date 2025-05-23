/* eslint-disable camelcase */
import {FilterType} from '../const.js';
import {isFuturedPoint, isPresentedPoint, isPastedPoint} from '../utils.js';

export default class PointsModel {
  #points = [];
  #destinations = [];
  #offers = [];
  #filterModel = null;
  #observers = [];
  #apiService = null;
  #isLoading = true;
  #isFailed = false;

  constructor({filterModel, apiService}) {
    this.#filterModel = filterModel;
    this.#apiService = apiService;
  }

  async init() {
    try {
      this.#isLoading = true;
      this.#isFailed = false;
      this.#notifyObservers();

      const [points, destinations, offers] = await Promise.all([
        this.#apiService.getPoints(),
        this.#apiService.getDestinations(),
        this.#apiService.getOffers(),
      ]);

      this.#points = points.map(this.#adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;
      this.#isFailed = false;
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this.#isFailed = true;
    } finally {
      this.#isLoading = false;
      this.#notifyObservers();
    }
  }

  get isLoading() {
    return this.#isLoading;
  }

  get isFailed() {
    return this.#isFailed;
  }

  #adaptToClient = (point) => ({
    ...point,
    date_from: point.date_from,
    date_to: point.date_to,
  });

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

  async updatePoint(updatedPoint) {
    try {
      const response = await this.#apiService.updatePoint(updatedPoint);
      const adaptedPoint = this.#adaptToClient(response);

      const index = this.#points.findIndex((point) => point.id === adaptedPoint.id);
      if (index === -1) {
        return false;
      }

      this.#points = [
        ...this.#points.slice(0, index),
        adaptedPoint,
        ...this.#points.slice(index + 1)
      ];

      this.#notifyObservers();
      return true;
    } catch (err) {
      return false;
    }
  }

  async addPoint(newPoint) {
    try {
      const response = await this.#apiService.addPoint(newPoint);
      const adaptedPoint = this.#adaptToClient(response);

      this.#points = [adaptedPoint, ...this.#points];
      this.#notifyObservers();
      return true;
    } catch (err) {
      return false;
    }
  }

  async deletePoint(pointId) {
    try {
      await this.#apiService.deletePoint({id: pointId});

      const initialLength = this.#points.length;
      this.#points = this.#points.filter((point) => point.id !== pointId);

      if (this.#points.length !== initialLength) {
        this.#notifyObservers();
      }
      return true;
    } catch (err) {
      return false;
    }
  }
}
