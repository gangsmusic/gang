import Service from './Service';
import MPV from './mpv';
import Dispatcher from '../Dispatcher';
import ActionTypes from '../ActionTypes';
import {updatePlayerState} from '../Actions';
import PlayerStore from '../PlayerStore';

export default class PlayerService extends Service {

  didStart() {
    const player = new MPV;

    Dispatcher.register(({type, payload}) => {
      switch(type) {
        case ActionTypes.UI_PLAY:
          if (payload) {
            player.play(payload.url);
          } else {
            player.play();
          }
          break;
        case ActionTypes.UI_PAUSE:
          player.pause();
          break;
        case ActionTypes.UI_SEEK:
          player.seek(payload);
          break;
        case ActionTypes.UI_SET_VOLUME:
          player.setVolume(payload);
          break;
      }
    });

    for (let event of ['playing', 'progress', 'duration', 'idle', 'volume', 'seekable']) {
      player.on(event, value => updatePlayerState({[event]: value}));
    }
  }

}
