import React from 'react';
import numeral from 'numeral';
import {colors} from './Theme';
import {VBox, HBox} from './Layout';
import StateFromStore from '../StateFromStore';
import PlayerStore from '../PlayerStore';


const CurrentDisplayStyle = {
  self: {
    alignItems: 'center'
  },
  meta: {
    marginRight: 10,
  },
  artist: {
    fontSize: 12,
    color: colors.fadedText
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.fadedText
  },
  playhead: {
    fontSize: 12,
    color: colors.fadedText
  }
};


const CurrentDisplay = React.createClass({

  mixins: [StateFromStore(PlayerStore)],

  render() {
    const {
      current: player_current,
      duration: player_duration,
      progress: player_progress,
      idle: player_idle
    } = this.state;
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
        <VBox style={CurrentDisplayStyle.meta}>
          {player_current &&
            <VBox style={CurrentDisplayStyle.name}>
              {player_current.get('name')}
            </VBox>}
          {player_current &&
            <VBox style={CurrentDisplayStyle.artist}>
              {player_current.get('artist')}
            </VBox>}
        </VBox>
        {playhead}
      </HBox>
    );
  }

});


module.exports = CurrentDisplay;
