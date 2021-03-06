import Immutable from 'immutable';
import Store from './Store';
import ActionTypes from './ActionTypes';

let PartyMemeber = Immutable.Record({
  name: null,
  nowPlaying: null
});

class LocalPartyStore extends Store {

  constructor() {
    super();
    this.state = Immutable.OrderedMap();
  }

  getState() {
    return this.state;
  }

  dehydrate() {
    return this.state.toJS();
  }

  hydrate(state) {
    this.state = Immutable.fromJS(state).map(item =>
      PartyMemeber({
        name: item.get('name'),
        nowPlaying: item.get('nowPlaying') ? Immutable.Map(item.get('nowPlaying')) : null
      }));
  }

  handleAction(action) {
    switch (action.type) {
      case ActionTypes.LOCAL_PARTY_PARTICIPANT_ADDED:
        let {name} = action.payload;
        this.transformState(state =>
          state.set(
            name,
            PartyMemeber({name, nowPlaying: null})
          ));
        break;
      case ActionTypes.LOCAL_PARTY_PARTICIPANT_REMOVED:
        this.transformState(state =>
            state.remove(action.payload.name));
        break;
      case ActionTypes.REMOTE_ACTION:
        this.handleRemoteAction(action.payload.action, action.payload.name);
        break;
    }
  }

  handleRemoteAction(action, name) {
    if (!this.state.has(name)) {
      return;
    }
    switch (action.type) {
      case ActionTypes.PLAYER_STATUS_SHARED:
        let track = action.payload.track;
        track = track ? Immutable.Map(track) : null;
        this.transformState(state =>
          state.set(
            name,
            state.get(name).set('nowPlaying', track)
          ));
        break;
    }
  }

}

export default LocalPartyStore.getInstance();

module.hot && module.hot.decline();
