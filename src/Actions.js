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

export function loadLibrary(tracks: object[]) {
  Dispatcher.dispatch({
    type: ActionTypes.LOAD_LIBRARY,
    payload: tracks
  });
}

export function addFile(path: string) {
  Dispatcher.dispatch({
    type: ActionTypes.ADD_FILE,
    payload: path
  });
}

export function addTrack(track: object) {
  Dispatcher.dispatch({
    type: ActionTypes.ADD_TRACK,
    payload: track
  });
}

export function updatePlayerState(state: object) {
  Dispatcher.dispatch({
    type: ActionTypes.UPDATE_PLAYER_STATE,
    payload: state
  });
}

export function uiPause() {
  Dispatcher.dispatch({
    type: ActionTypes.UI_PAUSE,
    payload: null
  });
}

export function uiPlay(track: object) {
  Dispatcher.dispatch({
    type: ActionTypes.UI_PLAY,
    payload: track
  });
}

export function uiSetVolume(volume: number) {
  Dispatcher.dispatch({
    type: ActionTypes.UI_SET_VOLUME,
    payload: volume
  });
}

export function uiSeek(position: number) {
  Dispatcher.dispatch({
    type: ActionTypes.UI_SEEK,
    payload: position
  });
}

export function uiChangeScreen(screen: string) {
  Dispatcher.dispatch({
    type: ActionTypes.UI_CHANGE_SCREEN,
    payload: screen
  });
}

export function uiSetConnected(connected: boolean) {
  Dispatcher.dispatch({
    type: ActionTypes.UI_SET_CONNECTED,
    payload: connected
  });
}

export function uiChangeSettingsScreen(screen: string) {
  Dispatcher.dispatch({
    type: ActionTypes.UI_CHANGE_SETTINGS_SCREEN,
    payload: screen
  });
}

export function uiWindowClose() {
  Dispatcher.dispatch({
    type: ActionTypes.UI_WINDOW_CLOSE,
    payload: null
  });
}

export function uiWindowMaximize() {
  Dispatcher.dispatch({
    type: ActionTypes.UI_WINDOW_MAXIMIZE,
    payload: null
  });
}

export function uiWindowMinimize() {
  Dispatcher.dispatch({
    type: ActionTypes.UI_WINDOW_MINIMIZE,
    payload: null
  });
}

module.hot && module.hot.decline();
