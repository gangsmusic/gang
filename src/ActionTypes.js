import keyMirror from 'key-mirror';

let ActionTypes = keyMirror({
  BOOTSTRAP_STORES: null,
  LOCAL_PARTY_PARTICIPANT_ADDED: null,
  LOCAL_PARTY_PARTICIPANT_REMOVED: null,
  LOAD_LIBRARY: null,
  ADD_FILE: null,
  ADD_TRACK: null,
  UPDATE_PLAYER_STATE: null,
  UI_PLAY: null,
  UI_PAUSE: null,
  UI_SET_VOLUME: null,
  UI_SEEK: null,
  UI_CHANGE_SCREEN: null,
  UI_SET_CONNECTED: null,
  UI_CHANGE_SETTINGS_SCREEN: null,
  UI_WINDOW_CLOSE: null,
  UI_WINDOW_MAXIMIZE: null,
  UI_WINDOW_MINIMIZE: null,
  PLAYER_STATUS_SHARED: null,
  REMOTE_ACTION: null
});

export default ActionTypes;

module.hot && module.hot.decline();
