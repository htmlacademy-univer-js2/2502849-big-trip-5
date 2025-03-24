import {getRandomPoint} from '../mock/point.js';
import {mockDestinations} from '../mock/destinations.js';
import {mockOffers} from '../mock/offers.js';

const POINT_COUNT = 4;

export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getDestinationById(destinationId) {
    return this.#destinations.find((destination) => destination.id === destinationId);
  }

  getOffersByType(type) {
    const offerGroup = this.#offers.find((offer) => offer.type === type);
    return offerGroup ? offerGroup.offers : [];
  }

  getOfferById(offerId) {
    for (const offerGroup of this.#offers) {
      const foundOffer = offerGroup.offers.find((offer) => offer.id === offerId);
      if (foundOffer) {
        return foundOffer;
      }
    }
    return null;
  }
}
