import ApiService from './api-service.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';

const apiService = new ApiService();
const filterModel = new FilterModel();
const pointsModel = new PointsModel({filterModel, apiService});

const presenter = new Presenter({
  eventsContainer: document.querySelector('.trip-events'),
  pointsModel,
  filterModel
});

new FilterPresenter({
  filtersContainer: document.querySelector('.trip-controls__filters'),
  pointsModel,
  filterModel
}).init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
  document.querySelector('.trip-main__event-add-btn').disabled = true;
  presenter.onNewPointButtonClick();
});

pointsModel.init().finally(() => {
  presenter.init();
});
