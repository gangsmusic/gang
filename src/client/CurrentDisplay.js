import React from 'react';
import numeral from 'numeral';
import {HBox} from './Layout';
import {Mixin as GangComponent} from './GangComponent';


const CurrentDisplayStyle = {
  self: {
    marginLeft: 16
  },
  playhead: {
    marginLeft: 8
  }
};


const CurrentDisplay = React.createClass({

  mixins: [GangComponent],

  statics: {
    observe: {
      player: ['current', 'duration', 'progress', 'idle']
    }
  },

  render() {
    const {player_current, player_duration, player_progress, player_idle} = this.state;
    var playhead = null;
    if (player_progress !== null && player_duration !== null && !player_idle) {
      const currentTime = numeral(player_progress).format('00:00');
      const durationTime = numeral(player_duration).format('00:00');
      playhead = (
        <div style={CurrentDisplayStyle.playhead}>{`${currentTime} / ${durationTime}`}</div>
      );
    }

    return (
      <HBox style={CurrentDisplayStyle.self}>
        {player_current && player_current.get('name')}
        {playhead}
      </HBox>
    );
  }

});


module.exports = CurrentDisplay;
