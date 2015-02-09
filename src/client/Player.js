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


const IconButtonStyle = {
  WebkitAppRegion: 'no-drag',
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
    const iconStyle = {
      ...(disabled ? IconButtonDisabledStyle : IconButtonStyle),
      style
    };
    return <Icon {...props} style={iconStyle} name={icon} />;
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
        <IconButton icon='backward' disabled={disabled} onClick={onPrev} style={{fontSize: 16}} />
        <PlayPauseButton onPlay={onPlay} onPause={onPause} playing={playing} disabled={disabled} />
        <IconButton icon='forward' disabled={disabled} onClick={onNext} style={{fontSize: 16}} />
      </HBox>
    );
  }

});


const PlayerStyle = {
  self: {
    WebkitAppRegion: 'drag',
    height: 60,
    background: colors.background,
    alignItems: 'center'
  },
  controls: {
    width: 130,
    justifyContent: 'center'
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    bottom: 0
  },
  volumeBar: {
    width: 100,
    flex: 'inherit'
  },
  currentDisplay: {
    flex: 1,
    margin: '0px 20px',
    justifyContent: 'space-between'
  }
};


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
    let {style, ...props} = this.props;
    player_playing = player_playing && !player_idle;
    var current = null;
    if (player_current && !player_idle) {
      const track = player_current.toJS();
      current = <VBox>{`${track.artist} - ${track.name}`}</VBox>;
    }
    return (
      <HBox {...props} style={{...PlayerStyle.self, ...style}}>
        <PlayerControls
          playing={player_playing}
          disabled={!player_current}
          onPlay={this.play}
          onPause={this.pause}
          onNext={this.next}
          onPrev={this.prev}
          />
        <VolumeBar style={PlayerStyle.volumeBar} />
        <CurrentDisplay style={PlayerStyle.currentDisplay} />
        {!player_idle &&
          <ProgressBar
            style={PlayerStyle.progressBar}
            onSeek={this.seek}
            value={player_progress}
            max={player_duration}
            />}
      </HBox>
    );
  }

});

module.exports = Player;
