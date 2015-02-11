import Immutable from 'immutable';
import Store from './Store';
import ActionTypes from './ActionTypes';

class LibraryStore extends Store {

  constructor() {
    super();
    this.tracks = Immutable.fromJS([]);
  }

  getState() {
    return {
      tracks: this.tracks
    };
  }

  dehydrate() {
    return this.tracks;
  }

  hydrate(tracks) {
    this.tracks = Immutable.fromJS(tracks);
  }

  emitChange() {
    super.emitChange();
    this.debug(`library contains ${this.tracks.count()} tracks`);
  }

  handleAction(action) {
    switch (action.type) {
      case ActionTypes.LOAD_LIBRARY:
        this.tracks = Immutable.fromJS(action.payload);
        this.emitChange();
        break;
      case ActionTypes.ADD_TRACK:
        const track = Immutable.fromJS(action.payload);
        if (!this.tracks.contains(track)) {
          this.tracks = this.tracks.push(track);
          this.emitChange();
        }
        break;
    }
  }

}

export default LibraryStore.getInstance();

module.hot && module.hot.decline();
