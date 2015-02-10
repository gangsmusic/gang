import ActionTypes from './ActionTypes';
import Dispatcher from './Dispatcher';

export function bootstrapStores() {
  let payload = Dispatcher.stores
    .filter(store => !store.isServerOnly)
    .map(store => ({name: store.name, state: store.dehydrate()}))
    .toArray();
  return {
    type: ActionTypes.BOOTSTRAP_STORES,
    payload
  };
}

export function localPartyParticipantAdded(name: string, host: string, port: number) {
  Dispatcher.dispatch({
    type: ActionTypes.LOCAL_PARTY_PARTICIPANT_ADDED,
    payload: {name, host, port}
  });
}

export function localPartyParticipantRemoved(name: string) {
  Dispatcher.dispatch({
    type: ActionTypes.LOCAL_PARTY_PARTICIPANT_REMOVED,
    payload: {name}
  });
}

module.hot && module.hot.decline();
