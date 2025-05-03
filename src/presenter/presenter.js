import {render, remove} from '../framework/render.js';
import {sortPointsByDay, sortPointsByTime, sortPointsByPrice} from '../utils.js';
import EventListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export default class Presenter {
  #eventList = new EventListView();
  #pointsModel = null;
  #filterModel = null;
  #eventsContainer = null;
  #filtersContainer = null;
  #pointPresenters = new Map();
  #currentEditingPointId = null;
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #emptyListComponent = null;

  constructor({pointsModel, filterModel}) {
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#filtersContainer = document.querySelector('.trip-controls__filters');

    this.#filterModel.addObserver(this.#onModelEvent);
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    this.#clearTrip();

    const points = this.#pointsModel.points;
    const filterType = this.#filterModel.filter;

    if (points.length === 0) {
      this.#renderEmptyList(filterType);
      return;
    }

    this.#renderPointsList();
  }

  #clearTrip() {
    this.#clearPoints();

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (this.#eventList) {
      remove(this.#eventList);
      this.#eventList = new EventListView();
    }
  }

  #onModelEvent = () => {
    this.#currentSortType = SortType.DAY;

    if (this.#sortComponent) {
      this.#sortComponent.update(SortType.DAY);
    }

    this.#clearTrip();
    this.#renderTrip();
  };

  #renderPointsList() {
    this.#renderSort();
    render(this.#eventList, this.#eventsContainer);
    this.#renderPoints();
  }

  #renderSort() {
    this.#sortComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#onSortTypeChange
    });
    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderPoints() {
    const points = this.#sortPoints(this.#pointsModel.points);

    points.forEach((point) => {
      if (!this.#pointPresenters.has(point.id)) {
        this.#renderPoint(point);
      }
    });
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

  #renderEmptyList(filterType) {
    this.#emptyListComponent = new EmptyListView({filterType});
    render(this.#emptyListComponent, this.#eventsContainer);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #sortPoints(points) {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...points].sort(sortPointsByTime);
      case SortType.PRICE:
        return [...points].sort(sortPointsByPrice);
      case SortType.DAY:
      default:
        return [...points].sort(sortPointsByDay);
    }
  }

  #onPointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id)?.init(updatedPoint);
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

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };
}
