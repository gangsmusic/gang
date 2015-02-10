import Immutable from 'immutable';
import Store from './Store';
import ActionTypes from './ActionTypes';

class PlayerStore extends Store {

  constructor() {
    super();
    this.state = Immutable.fromJS({
      duration: null,
      progress: null,
      current: null,
      playing: false,
      idle: true,
      seekable: false,
      volume: 100,
      playQueue: []
    });
  }

  getState() {
    return this.state.toJS();
  }

  dehydrate() {
    return this.getState();
  }

  hydrate(state) {
    this.state = Immutable.fromJS(state);
  }

  handleAction(action) {
    switch (action.type) {
      case ActionTypes.UPDATE_PLAYER_STATE:
        const newState = this.state.merge(Immutable.fromJS(action.payload));
        if (!Immutable.is(newState, this.state)) {
          this.state = newState;
          this.emitChange();
        }
        break;
      case ActionTypes.UI_PLAY:
        if (action.payload) {
          this.state = this.state.merge(Immutable.fromJS({current: action.payload}));
          this.emitChange();
        }
        break;
    }
  }

}

export default PlayerStore.getInstance();

module.hot && module.hot.decline();
