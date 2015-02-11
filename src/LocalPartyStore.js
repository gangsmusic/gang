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
        nowPlaying: item.get('nowPlaying') ? Immutable.Map(nowPlaying.get('nowPlaying')) : null
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
      case ActionTypes.UI_PLAY:
        this.transformState(state =>
          state.set(
            name,
            state.get(name).set('nowPlaying', Immutable.Map(action.payload))
          ));
        break;
      case ActionTypes.UPDATE_PLAYER_STATE:
        if (action.payload.idle !== false) {
          return;
        }
        this.transformState(state =>
          state.set(
            name,
            state.get(name).set('nowPlaying', null)
          ));
        break;
    }
  }

}

export default LocalPartyStore.getInstance();

module.hot && module.hot.decline();
