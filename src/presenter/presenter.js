import {render} from '../render.js';
import FiltersView from '../view/filters-view';
import FormCreationView from '../view/form-creation-view';
import FormEditingView from '../view/form-editing-view';
import EventListView from '../view/event-list-view';
import EventItemView from '../view/event-item-view';
import SortingView from '../view/sorting-view';


export default class Presenter {
  eventList = new EventListView();

  constructor() {
    this.events = document.querySelector('.trip-events');
    this.filters = document.querySelector('.trip-controls__filters');
  }

  init() {
    render(new FiltersView(), this.filters);
    render(new SortingView(), this.events);
    render(this.eventList, this.events);
    render(new FormEditingView(), this.eventList.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventItemView(), this.eventList.getElement());
    }

    render(new FormCreationView(), this.eventList.getElement());
  }
}
