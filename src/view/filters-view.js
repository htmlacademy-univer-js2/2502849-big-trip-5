import AbstractView from '../framework/view/abstract-view.js';


function createFiltersTemplate(filters) {
  return `<form class="trip-filters" action="#" method="get">
            ${filters.map((filter, index) => `
              <div class="trip-filters__filter">
                <input id="filter-${filter.type}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${filter.type}"
                  ${index === 0 ? 'checked' : ''}
                  ${filter.count === 0 ? 'disabled' : ''}>
              <label class="trip-filters__filter-label" for="filter-${filter.type}"> ${filter.type}</label>
              </div>
            `).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>`;
}

export default class FiltersView extends AbstractView {
  #filters = [];

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
