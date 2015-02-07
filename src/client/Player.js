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
  controls: {
    width: 32 * 3 + 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

const IconButtonStyle = {
  fontSize: 24,
  height: 32,
  width: 32,
  lineHeight: '32px',
  textAlign: 'center',
  color: colors.controls,
  cursor: 'pointer'
};

const IconButtonDisabledStyle = {
  ...IconButtonStyle,
  color: colors.controlsDisabled,
  cursor: 'default'
};


const IconButton = React.createClass({

  render() {
    const {disabled, icon, style, ...props} = this.props;
    const style = Object.assign({}, disabled ? IconButtonDisabledStyle : IconButtonStyle, style);
    return <Icon {...props} style={style} name={icon} />;
  }

});


const PlayPauseButton = React.createClass({

  render() {
    const {playing, onPlay, onPause, ...props} = this.props;
    const icon = playing ? 'pause' : 'play';
    const onClick = playing ? onPause : onPlay;
    return <IconButton {...props} icon={icon} onClick={onClick} />;
  }

});


const PlayerControls = React.createClass({

  render() {
    const {playing, disabled, onPlay, onPause, onNext, onPrev} = this.props;
    return (
      <HBox style={PlayerStyle.controls}>
        <IconButton icon='backward' disabled={disabled} onClick={onPrev} />
        <PlayPauseButton onPlay={onPlay} onPause={onPause} playing={playing} disabled={disabled} />
        <IconButton icon='forward' disabled={disabled} onClick={onNext} />
      </HBox>
    );
  }

});


const Player = React.createClass({

  mixins: [GangComponentMixin],

  statics: {
    observe: {
      player: ['duration', 'idle', 'current', 'playing', 'progress'],
      library: ['tracks']
    }
  },

  play() {
    if (this.state.player_progress !== null) {
      this.dispatch('play');
    } else if (this.state.player_current) {
      this.dispatch('play', this.state.player_current);
    }
  },

  pause() {
    this.dispatch('pause');
  },

  next() {
    const index = this.state.library_tracks.indexOf(this.state.player_current);
    if (index !== -1 && index < this.state.library_tracks.count() - 1) {
      this.dispatch('play', this.state.library_tracks.get(index + 1));
    }
  },

  prev() {
    const index = this.state.library_tracks.indexOf(this.state.player_current);
    if (index > 0) {
      this.dispatch('play', this.state.library_tracks.get(index - 1));
    }
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
        <PlayerControls
          playing={player_playing}
          disabled={!player_current}
          onPlay={this.play}
          onPause={this.pause}
          onNext={this.next}
          onPrev={this.prev}
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
