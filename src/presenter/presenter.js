import {isEscapeKey} from '../utils.js';
import {render, replace} from '../framework/render.js';
import FiltersView from '../view/filters-view';
import FormEditingView from '../view/form-editing-view';
import EventListView from '../view/event-list-view';
import EventView from '../view/event-view.js';
import SortingView from '../view/sorting-view';

export default class Presenter {
  #eventList = new EventListView();
  #pointsModel = null;
  #eventsContainer = null;
  #filtersContainer = null;

  constructor({pointsModel}) {
    this.#pointsModel = pointsModel;
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#filtersContainer = document.querySelector('.trip-controls__filters');
  }

  init() {
    const points = this.#pointsModel.points;

    render(new FiltersView(), this.#filtersContainer);
    render(new SortingView(), this.#eventsContainer);
    render(this.#eventList, this.#eventsContainer);

    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = point.offers.map((offerId) => this.#pointsModel.getOfferById(offerId));

    const onDocumentKeydown = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        switchToRoutePoint();
        document.removeEventListener('keydown', onDocumentKeydown);
      }
    };

    const editingForm = new FormEditingView({
      point,
      destination,
      offers,
      onSubmit: () => {
        switchToRoutePoint();
        document.removeEventListener('keydown', onDocumentKeydown);
      },
      onRollupButtonClick: () => {
        switchToRoutePoint();
        document.removeEventListener('keydown', onDocumentKeydown);
      }
    });

    const routePoint = new EventView({
      point,
      destination,
      offers,
      onRollupButtonClick: () => {
        switchToEditingForm();
        document.addEventListener('keydown', onDocumentKeydown);
      }
    });

    function switchToEditingForm() {
      replace(editingForm, routePoint);
    }

    function switchToRoutePoint() {
      replace(routePoint, editingForm);
    }

    render(routePoint, this.#eventList.element);
  }
}
