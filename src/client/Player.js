import React from 'react';
import numeral from 'numeral';
import Immutable from 'immutable';
import {HBox, VBox, VBoxStyle} from './Layout';
import {rgba} from './StyleUtils';
import Icon from './Icon';
import ProgressBar from './ProgressBar';
import {colors} from './Theme';
import VolumeBar from './VolumeBar';
import CoverArt from './CoverArt';
import WindowButtons from './WindowButtons';
import CurrentDisplay from './CurrentDisplay';
import StateFromStore from '../StateFromStore';
import LibraryStore from '../LibraryStore';
import PlayerStore from '../PlayerStore';
import ClickFeedback from './ClickFeedback';
import {uiPlay, uiPause, uiSeek} from '../Actions';


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
    const {disabled, icon, style, onClick, ...props} = this.props;
    const iconStyle = {
      ...(disabled ? IconButtonDisabledStyle : IconButtonStyle),
      style
    };
    return (
      <ClickFeedback onClick={onClick}>
        <Icon
          {...props}
          style={iconStyle}
          name={icon}
          />
      </ClickFeedback>
    );
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
    alignItems: 'center',
    paddingLeft: 24
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

  mixins: [StateFromStore(LibraryStore, PlayerStore)],

  play() {
    if (this.state.PlayerStore.progress !== null) {
      uiPlay();
    } else if (this.state.PlayerStore.current) {
      uiPlay(this.state.PlayerStore.current);
    }
  },

  pause() {
    uiPause();
  },

  next() {
    const tracks = this.state.LibraryStore.tracks;
    const index = tracks.indexOf(Immutable.fromJS(this.state.PlayerStore.current));
    if (index !== -1 && index < tracks.count() - 1) {
      uiPlay(tracks.get(index + 1));
    }
  },

  prev() {
    const tracks = this.state.LibraryStore.tracks;
    const index = tracks.indexOf(Immutable.fromJS(this.state.PlayerStore.current));
    if (index > 0) {
      uiPlay(tracks.get(index - 1));
    }
  },

  seek(position) {
    uiSeek(position);
  },

  render() {
    let {
      current: player_current,
      playing: player_playing,
      idle: player_idle,
      progress: player_progress,
      duration: player_duration,
      seekable: player_seekable
    } = this.state.PlayerStore;

    let {style, ...props} = this.props;
    player_playing = player_playing && !player_idle;
    var current = null;
    if (player_current && !player_idle) {
      current = <VBox>{`${player_current.artist} - ${player_current.name}`}</VBox>;
    }
    return (
      <HBox {...props} style={{...PlayerStyle.self, ...style}}>
        <WindowButtons />
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
        {player_current &&
          <CoverArt
            track={Immutable.fromJS(player_current)}
            size={PlayerStyle.self.height}
            />}
        {!player_idle && player_seekable &&
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
