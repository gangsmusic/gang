import React from 'react';
import {rgba} from './StyleUtils';
import {colors} from './Theme';
import {Mixin as GangComponent} from './GangComponent';


const VolumeBarStyle = {
  self: {
    width: 100
  },
  idle: {
    pointerEvents: 'none',
    opacity: 0.3
  },
  canvas: {
    background: rgba(0, 0, 0, 0.1),
    cursor: 'pointer'
  },
  bar: {
    background: colors.accent,
    height: 12
  }
};


const VolumeBar = React.createClass({

  mixins: [GangComponent],

  statics: {
    observe: {
      player: ['volume', 'idle']
    }
  },

  onClick(e) {
    const {left, width} = this.getDOMNode().getBoundingClientRect();
    const position = (e.clientX - left) / width;
    this.dispatch('volume', Math.round(position * 100));
  },

  render() {
    const {player_volume, player_idle} = this.state;
    const volume = player_volume === null ? 100 : player_volume;
    const barStyle = {
      ...VolumeBarStyle.bar,
      width: `${volume}%`
    };
    const selfStyle = {
      ...VolumeBarStyle.self,
      ...(player_idle && VolumeBarStyle.idle)
    };
    return (
      <div style={selfStyle}>
        <div style={VolumeBarStyle.canvas} onClick={this.onClick}>
          <div style={barStyle} />
        </div>
      </div>
    );
  }

});


module.exports = VolumeBar;
