import {isEscapeKey} from '../utils.js';
import {render, replace} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import FormEditingView from '../view/form-editing-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';
import SortingView from '../view/sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {generateFilters} from '../mock/filters.js';

export default class Presenter {
  #eventList = new EventListView();
  #pointsModel = null;
  #eventsContainer = null;
  #filtersContainer = null;
  #emptyListComponent = new EmptyListView();

  constructor({pointsModel}) {
    this.#pointsModel = pointsModel;
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#filtersContainer = document.querySelector('.trip-controls__filters');
  }

  init() {
    const points = this.#pointsModel.points;

    if (points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointsList();
    }
  }

  #renderPointsList() {
    const points = this.#pointsModel.points;
    const filters = generateFilters(points);

    render(new FiltersView({filters}), this.#filtersContainer);
    render(new SortingView(), this.#eventsContainer);
    render(this.#eventList, this.#eventsContainer);

    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#eventsContainer);
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
