import debounce from 'debounce';
import Immutable from 'immutable';
import Store from './Store';
import ActionTypes from './ActionTypes';
import LibraryStore from './LibraryStore';

let SearchState = Immutable.Record({
  query: '',
  results: Immutable.List()
});

class SearchStore extends Store {

  constructor() {
    super();
    this.state = SearchState();
    this._search = debounce(this._search, 500);
  }

  dehydrate() {
    return this.state.toJS();
  }

  hydrate(state) {
    this.state = SearchState({
      query: state.query,
      results: Immutable.fromJS(state.results)
    });
  }

  handleAction(action) {
    switch (action.type) {
      case ActionTypes.SEARCH:
        let {query} = action.payload;
        if (query === '') {
          this.transformState(state =>
            SearchState({query, results: Immutable.List()}));
        } else {
          this.transformState(state =>
            state.set('query', query));
          this._search();
        }
        break;
    }
  }

  _search() {
    let queryRe = new RegExp(this.state.query, 'i');
    let {tracks} = LibraryStore.getState();
    let results = tracks
      .filter(track =>
        queryRe.exec(track.get('name')) ||
        queryRe.exec(track.get('artist')))
      .take(30);
    this.transformState(state => state.set('results', results));
  }
}

let searchStore = SearchStore.getInstance();

export default searchStore;

module.hot && module.hot.decline();
