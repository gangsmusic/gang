import React from 'react';
import numeral from 'numeral';
import {HBox, VBox, VBoxStyle} from './Layout';
import {rgba} from './StyleUtils';
import Icon from './Icon';
import {Mixin as GangComponentMixin} from './GangComponent';
import ProgressBar from './ProgressBar';
import {colors} from './Theme';
import VolumeBar from './VolumeBar';
import CurrentDisplay from './CurrentDisplay';


const PlayerStyle = {
  self: {
    height: 60,
    background: colors.background,
    alignItems: 'center'
  },
  controls: {
    width: 130,
    justifyContent: 'center'
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
        <IconButton icon='backward' disabled={disabled} onClick={onPrev} style={{fontSize: 20}} />
        <PlayPauseButton onPlay={onPlay} onPause={onPause} playing={playing} disabled={disabled} />
        <IconButton icon='forward' disabled={disabled} onClick={onNext} style={{fontSize: 20}} />
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
    let {player_current, player_playing, player_idle, player_progress, player_duration} = this.state;
    player_playing = player_playing && !player_idle;
    var current = null;
    if (player_current && !player_idle) {
      const track = player_current.toJS();
      current = <VBox>{`${track.artist} - ${track.name}`}</VBox>;
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
        <VolumeBar />
        <HBox>
          <CurrentDisplay />
        </HBox>
        {!player_idle &&
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
