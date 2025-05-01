import {getRandomPoint} from '../mock/point.js';
import {mockDestinations} from '../mock/destinations.js';
import {mockOffers} from '../mock/offers.js';

const POINT_COUNT = 4;


export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return [...this.#points];
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
  }
}
