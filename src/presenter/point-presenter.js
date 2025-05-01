import {isEscapeKey} from '../utils.js';
import {render, replace, remove} from '../framework/render.js';
import FormEditingView from '../view/form-editing-view.js';
import EventView from '../view/event-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};


export default class PointPresenter {
  #eventList = null;
  #point = null;
  #destination = null;
  #offers = null;
  #pointsModel = null;
  #onDataChange = null;
  #onModeChange = null;
  #routePoint = null;
  #editingForm = null;
  #mode = Mode.DEFAULT;

  constructor({eventList, pointsModel, onDataChange, onModeChange}) {
    this.#eventList = eventList;
    this.#pointsModel = pointsModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#destination = this.#pointsModel.getDestinationById(point.destination);
    this.#offers = point.offers.map((offerId) => this.#pointsModel.getOfferById(offerId));

    const prevRoutePoint = this.#routePoint;
    const prevEditingForm = this.#editingForm;

    this.#routePoint = new EventView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onRollupButtonClick: this.#onRollupButtonClick,
      onFavoriteClick: this.#onFavoriteClick
    });

    this.#editingForm = new FormEditingView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#pointsModel.getOffersByType(this.#point.type),
      allDestinations: this.#pointsModel.destinations,
      allOffers: this.#pointsModel.offers,
      onFormSubmit: this.#onFormSubmit,
      onRollupButtonClick: this.#onRollupButtonClick
    });

    if (prevRoutePoint === null || prevEditingForm === null) {
      render(this.#routePoint, this.#eventList.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#routePoint, prevRoutePoint);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editingForm, prevEditingForm);
    }

    remove(prevRoutePoint);
    remove(prevEditingForm);
  }

  destroy() {
    remove(this.#routePoint);
    remove(this.#editingForm);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#switchToRoutePoint();
    }
  }

  #switchToEditingForm() {
    this.#onModeChange(this.#point.id);
    replace(this.#editingForm, this.#routePoint);
    document.addEventListener('keydown', this.#onDocumentKeydown);
    this.#mode = Mode.EDITING;
  }

  #switchToRoutePoint() {
    replace(this.#routePoint, this.#editingForm);
    document.removeEventListener('keydown', this.#onDocumentKeydown);
    this.#mode = Mode.DEFAULT;
  }

  #onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#switchToRoutePoint();
      this.#onModeChange(null);
    }
  };

  #onRollupButtonClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#switchToEditingForm();
    } else {
      this.#switchToRoutePoint();
      this.#onModeChange(null);
    }
  };

  #onFavoriteClick = (updatedPoint) => {
    this.#onDataChange(updatedPoint);
  };

  #onFormSubmit = () => {
    this.#switchToRoutePoint();
    this.#onModeChange(null);
  };
}
