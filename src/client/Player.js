const React = require('react');
const numeral = require('numeral');
import {HBox, Box} from './Box';
import {rgba} from './StyleUtils';
import Icon from './Icon';

const PlayerStyle = {
  self: {
    height: 60,
    background: rgba(0, 0, 0, 0.1)
  },
  playButton: {
    width: 60,
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

  mixins: [require('./GangComponent').Mixin],

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

  seek(e) {
    const rect = e.target.getBoundingClientRect();
    const componentX = e.clientX - rect.left;
    const position = this.state.player_duration * componentX / rect.width;
    this.dispatch('seek', position);
  },

  render() {
    const idle = this.state.player_idle;
    const playing = this.state.player_playing && !idle;
    var current = null;
    if (this.state.player_current && !idle) {
      const track = this.state.player_current.toJS();
      current = <Box>{`${track.artist} - ${track.name}`}</Box>;
    }
    var playhead = null;
    if (this.state.player_progress !== null && this.state.player_duration !== null && !idle) {
      const currentTime = numeral(this.state.player_progress).format('00:00');
      const durationTime = numeral(this.state.player_duration).format('00:00');
      playhead = (
        <Box>
          <progress onClick={this.seek} value={this.state.player_progress} max={this.state.player_duration} />
          <div>{`${currentTime} / ${durationTime}`}</div>
        </Box>
      );
    }
    return (
      <HBox style={PlayerStyle.self}>
        <PlayPauseButton
          style={PlayerStyle.playButton}
          playing={playing}
          onPlay={this.play}
          onPause={this.pause}
          />
        <HBox>
          {current}
          {playhead}
        </HBox>
      </HBox>
    );
  }

});

module.exports = Player;
