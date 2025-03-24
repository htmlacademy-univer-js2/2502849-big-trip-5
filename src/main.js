import Presenter from './presenter/presenter';
import PointsModel from './model/model';


const pointsModel = new PointsModel();
new Presenter({pointsModel}).init();
