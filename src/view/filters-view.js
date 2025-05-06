import AbstractView from '../framework/view/abstract-view.js';

function createFiltersTemplate(filters, currentFilterType) {
  return `<form class="trip-filters" action="#" method="get">
          ${filters.map((filter) => `
          <div class="trip-filters__filter">
            <input id="filter-${filter.type}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter"
            value="${filter.type}"
            ${filter.type === currentFilterType ? 'checked' : ''}
            ${filter.type !== 'EVERYTHING' && filter.count === 0 ? 'disabled' : ''}>
          <label class="trip-filters__filter-label" for="filter-${filter.type}"> ${filter.type}</label>
          </div>
        `).join('')}
      </form>`;
}

export default class FiltersView extends AbstractView {
  #filters = [];
  #currentFilterType = null;
  #onFilterChange = null;

  constructor({filters, currentFilterType, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#onFilterInputChange);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #onFilterInputChange = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.#onFilterChange(evt.target.value);
    }
  };
}
