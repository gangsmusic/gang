import React from 'react';
import numeral from 'numeral';
import {HBox, VBox, VBoxStyle} from './Layout';
import {rgba} from './StyleUtils';
import Icon from './Icon';
import {Mixin as GangComponentMixin} from './GangComponent';
import ProgressBar from './ProgressBar';
import {colors} from './Theme';

const PlayerStyle = {
  self: {
    height: 60,
    background: colors.background
  },
  playButton: {
    ...VBoxStyle,
    width: 60,
    height: 60,
    justifyContent: 'center',
    color: colors.controls,
    background: 'none',
    border: 'none',
    outline: 'none'
  }
};

const PlayPauseButton = React.createClass({

  render() {
    var {playing, onPlay, onPause, ...props} = this.props;
    var icon = playing ? 'pause' : 'play';
    var onClick = playing ? onPause : onPlay;
    return (
      <button {...props} onClick={onClick}>
        <Icon name={icon} />
      </button>
    );
  }
});

const Player = React.createClass({

  mixins: [GangComponentMixin],

  statics: {
    observe: {
      player: ['duration', 'idle', 'current', 'playing', 'progress']
    }
  },

  play() {
    this.dispatch('play');
  },

  pause() {
    this.dispatch('pause');
  },

  seek(position) {
    this.dispatch('seek', position);
  },

  render() {
    let {player_current, player_duration, player_progress, player_playing, player_idle} = this.state;
    player_playing = player_playing && !player_idle;
    var current = null;
    if (player_current && !player_idle) {
      const track = player_current.toJS();
      current = <VBox>{`${track.artist} - ${track.name}`}</VBox>;
    }
    var playhead = null;
    var showProgress = player_progress !== null && player_duration !== null && !player_idle;
    if (showProgress) {
      const currentTime = numeral(player_progress).format('00:00');
      const durationTime = numeral(player_duration).format('00:00');
      playhead = (
        <VBox>
          <div>{`${currentTime} / ${durationTime}`}</div>
        </VBox>
      );
    }
    return (
      <HBox style={PlayerStyle.self}>
        <PlayPauseButton
          style={PlayerStyle.playButton}
          playing={player_playing}
          onPlay={this.play}
          onPause={this.pause}
          />
        <HBox>
          {current}
          {playhead}
        </HBox>
        {showProgress &&
          <ProgressBar
            onSeek={this.seek}
            value={player_progress}
            max={player_duration}
            />}
      </HBox>
    );
  }

});

module.exports = Player;
