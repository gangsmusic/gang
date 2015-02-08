import React from 'react';
import numeral from 'numeral';
import {colors} from './Theme';
import {VBox, HBox} from './Layout';
import {Mixin as GangComponent} from './GangComponent';


const CurrentDisplayStyle = {
  self: {
  },
  name: {
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.fadedText
  },
  playhead: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.fadedText
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
    const {style, ...props} = this.props;
    var playhead = null;
    if (player_progress !== null && player_duration !== null && !player_idle) {
      const currentTime = numeral(player_progress).format('00:00');
      const durationTime = numeral(player_duration).format('00:00');
      playhead = (
        <VBox style={CurrentDisplayStyle.playhead}>{`${currentTime} / ${durationTime}`}</VBox>
      );
    }

    return (
      <HBox {...props} style={{...CurrentDisplayStyle.self, ...style}}>
        <VBox style={CurrentDisplayStyle.name}>
          {player_current && player_current.get('name')}
        </VBox>
        {playhead}
      </HBox>
    );
  }

});


module.exports = CurrentDisplay;
