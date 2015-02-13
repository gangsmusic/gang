import Immutable from 'immutable';
import Store from './Store';
import ActionTypes from './ActionTypes';

class RecentPlayedTracksStore extends Store {

  constructor() {
    super();
    this.state = Immutable.OrderedSet();
    this.pendingTimer = null;
  }

  dehydrate() {
    return this.state.toJS();
  }

  hydrate(state) {
    this.state = Immutable.OrderedSet(Immutable.fromJS(state));
  }

  handleAction(action) {
    switch (action.type) {
      case ActionTypes.UI_PLAY:
        let track = Immutable.fromJS(action.payload);
        if (!track) {
          return;
        }
        clearTimeout(this.pendingTimer);
        this.pendingTimer = setTimeout(() => {
          this.transformState(state => state.add(track).takeLast(10));
        }, 2000);
        break;
    }
  }

}

export default RecentPlayedTracksStore.getInstance();

module.hot && module.hot.decline();
