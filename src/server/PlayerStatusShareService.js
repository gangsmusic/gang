import * as Actions from '../Actions';
import PlayerStore from '../PlayerStore';
import Service from './Service';

export default class PlayerStatusShareService extends Service {
  
  didStart() {
    this._interval = setInterval(this._sharePlayerStatus.bind(this), 1000);
  }

  didStop() {
    clearInterval(this._interval);
  }

  _sharePlayerStatus() {
    let {current, playing, idle} = PlayerStore.getState();
    let track = playing && !idle ? current : null;
    Actions.playerStatusShared(track);
  }
}
