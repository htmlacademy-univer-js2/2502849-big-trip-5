import {formatEventDate, sortPointsByDay} from '../utils.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;

  constructor({tripInfoContainer, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#onModelEvent);
  }

  init() {
    this.#updateTripInfo();
  }

  #onModelEvent = () => {
    this.#updateTripInfo();
  };

  #updateTripInfo() {
    const points = this.#pointsModel.points;
    if (points.length === 0) {
      this.#tripInfoContainer.innerHTML = '';
      return;
    }

    const sortedPoints = [...points].sort(sortPointsByDay);
    const firstPoint = sortedPoints[0];
    const lastPoint = sortedPoints[sortedPoints.length - 1];

    const route = this.#getRouteText(sortedPoints);
    const dates = this.#getDatesText(firstPoint.date_from, lastPoint.date_to);
    const cost = this.#calculateTotalCost(points);

    this.#tripInfoContainer.innerHTML = `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>`;
  }

  #getRouteText(points) {
    const destinationNames = points.map((point) => {
      const destination = this.#pointsModel.getDestinationById(point.destination);
      return destination ? destination.name : '';
    }).filter((name) => name);

    if (destinationNames.length <= 3) {
      return destinationNames.join(' &mdash; ');
    }
    return `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`;
  }

  #getDatesText(startDate, endDate) {
    const start = formatEventDate(startDate);
    const end = formatEventDate(endDate);
    return `${start}&nbsp;&mdash;&nbsp;${end}`;
  }

  #calculateTotalCost(points) {
    return points.reduce((total, point) => {
      const pointOffers = this.#pointsModel.getOffersByType(point.type);
      const selectedOffers = pointOffers.filter((offer) => point.offers.includes(offer.id));
      const offersCost = selectedOffers.reduce((sum, offer) => sum + offer.price, 0);
      return total + point.base_price + offersCost;
    }, 0);
  }
}
