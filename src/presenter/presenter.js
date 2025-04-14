import {render} from '../framework/render.js';
import {generateFilters} from '../mock/filters.js';
import FiltersView from '../view/filters-view.js';
import EventListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';

export default class Presenter {
  #eventList = new EventListView();
  #pointsModel = null;
  #eventsContainer = null;
  #filtersContainer = null;
  #emptyListComponent = new EmptyListView();
  #pointPresenters = new Map();
  #currentEditingPointId = null;

  constructor({pointsModel}) {
    this.#pointsModel = pointsModel;
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#filtersContainer = document.querySelector('.trip-controls__filters');
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    const points = this.#pointsModel.points;

    if (points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderPointsList();
  }

  #renderPointsList() {
    render(new FiltersView({
      filters: generateFilters(this.#pointsModel.points)
    }), this.#filtersContainer);

    render(new SortingView(), this.#eventsContainer);
    render(this.#eventList, this.#eventsContainer);

    this.#renderPoints();
  }

  #renderPoints() {
    this.#pointsModel.points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventList: this.#eventList,
      pointsModel: this.#pointsModel,
      onDataChange: this.#onPointChange,
      onModeChange: this.#onModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#eventsContainer);
  }

  #onPointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #onModeChange = (pointId) => {
    if (this.#currentEditingPointId === pointId) {
      return;
    }

    if (this.#currentEditingPointId) {
      this.#pointPresenters.get(this.#currentEditingPointId)?.resetView();
    }

    this.#currentEditingPointId = pointId;
  };
}
