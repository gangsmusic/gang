import Store from '../Store';
import ActionTypes from '../ActionTypes';

class UiStore extends Store {

  constructor() {
    super();
    this.activeScreen = 'browser';
    this.settingsScreen = 'profile';
    this.ready = false;
    this.connected = false;
  }

  getState() {
    return {
      activeScreen: this.activeScreen,
      settingsScreen: this.settingsScreen,
      ready: this.ready,
      connected: this.connected
    };
  }

  handleAction(action) {
    switch(action.type) {
      case ActionTypes.UI_CHANGE_SCREEN:
        this.activeScreen = action.payload;
        this.emitChange();
        break;
      case ActionTypes.UI_CHANGE_SETTINGS_SCREEN:
        this.settingsScreen = action.payload;
        this.emitChange();
        break;
      case ActionTypes.UI_SET_CONNECTED:
        this.connected = action.payload;
        if (!this.connected) {
          this.ready = false;
        }
        this.emitChange();
        break;
    }
  }

  _handleAction(action) {
    switch(action.type) {
      case ActionTypes.BOOTSTRAP_STORES:
        this.ready = true;
        this.emitChange();
        break;
      default:
        this.handleAction(action)
        break;
    }
  }

}

export default UiStore.getInstance();
