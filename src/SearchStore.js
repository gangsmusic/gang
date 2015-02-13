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
          let results = this._search(query);
          this.transformState(state =>
            SearchState({query, results}));
        }
        break;
    }
  }

  _search(query) {
    let queryRe = new RegExp(query, 'i');
    let {tracks} = LibraryStore.getState();
    tracks = tracks.filter(track =>
      queryRe.exec(track.get('name')) ||
      queryRe.exec(track.get('artist')));
    return tracks;
  }
}

let searchStore = SearchStore.getInstance();

export default searchStore;

module.hot && module.hot.decline();
