import Presenter from './presenter/presenter.js';
import PointsModel from './model/model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';

const filterModel = new FilterModel();
const pointsModel = new PointsModel({filterModel});

new Presenter({pointsModel, filterModel}).init();
new FilterPresenter({filtersContainer: document.querySelector('.trip-controls__filters'), pointsModel, filterModel}).init();
