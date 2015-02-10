import React from 'react';
import {rgba, border} from './StyleUtils';
import {colors} from './Theme';
import ProgressBar from './ProgressBar'
import {VBox} from './Layout';
import StateFromStore from '../StateFromStore';
import PlayerStore from '../PlayerStore';
import {uiSetVolume} from '../Actions';

const VolumeBarStyle = {
  self: {
    borderBottom: border(1, border.style.solid, rgba(0, 0, 0, 0.05))
  }
};

let VolumeBar = React.createClass({

  mixins: [StateFromStore(PlayerStore)],

  statics: {
    observe: {}
  },

  render() {
    const {style, ...props} = this.props;
    const {volume: player_volume} = this.state.PlayerStore;
    const volume = player_volume === null ? 100 : player_volume;
    return (
      <ProgressBar
        {...props}
        style={{...VolumeBarStyle.self, ...style}}
        value={volume}
        max={100}
        onSeek={this.onSeek}
        />
    );
  },

  onSeek(volume) {
    uiSetVolume(Math.round(volume));
  }

});

export default VolumeBar;
