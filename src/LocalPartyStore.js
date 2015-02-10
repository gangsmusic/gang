import Immutable from 'immutable';
import Store from './Store';
import ActionTypes from './ActionTypes';

class LocalPartyStore extends Store {

  constructor() {
    super();
    this.state = new Immutable.OrderedMap();
  }

  getState() {
    return this.state;
  }

  dehydrate() {
    return this.state.toJS();
  }

  hydrate(state) {
    this.state = Immutable.OrderedMap(state);
  }

  handleAction(action) {
    switch (action.type) {
      case ActionTypes.LOCAL_PARTY_PARTICIPANT_ADDED:
        let {name, host, port} = action.payload;
        this.state = this.state.set(name, {name, host, port});
        this.emitChange();
        break;
      case ActionTypes.LOCAL_PARTY_PARTICIPANT_REMOVED:
        this.state = this.state.remove(action.payload.name);
        this.emitChange();
        break;
    }
  }

}

export default new LocalPartyStore();
