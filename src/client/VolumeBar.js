import React from 'react';
import {rgba, border} from './StyleUtils';
import {colors} from './Theme';
import {Mixin as GangComponent} from './GangComponent';
import ProgressBar from './ProgressBar'
import {VBox} from './Layout';
import StateFromStore from '../StateFromStore';
import PlayerStore from '../PlayerStore';

const VolumeBarStyle = {
  self: {
    borderBottom: border(1, border.style.solid, rgba(0, 0, 0, 0.05))
  }
};

let VolumeBar = React.createClass({

  mixins: [GangComponent, StateFromStore(PlayerStore)],

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
    this.dispatch('volume', Math.round(volume));
  }

});

export default VolumeBar;
