import keyMirror from 'key-mirror';

let ActionTypes = keyMirror({
  BOOTSTRAP_STORES: null,
  LOCAL_PARTY_PARTICIPANT_ADDED: null,
  LOCAL_PARTY_PARTICIPANT_REMOVED: null,
  LOAD_LIBRARY: null,
  UPDATE_PLAYER_STATE: null
});

export default ActionTypes;

module.hot && module.hot.decline();
