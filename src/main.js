import Presenter from './presenter/presenter';
import PointsModel from './model/model';

new Presenter({pointsModel: new PointsModel()}).init();
