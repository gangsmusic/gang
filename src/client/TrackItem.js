import React from 'react';
import * as Actions from '../Actions';
import {HBox,VBox} from './Layout';
import {rgba, boxShadow} from './StyleUtils';
import CoverArt from './CoverArt';
import Hoverable from './Hoverable';
import Icon from './Icon';

let TrackItemStyle = {
  self: {
    color: rgba(0, 0, 0, 0.6),
    cursor: 'pointer',
    height: 50
  },
  meta: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10
  },
  name: {
    fontWeight: 'bold'
  },
  artist: {
    fontSize: 12,
    fontWeight: 'normal'
  },
  cover: {
    justifyContent: 'center'
  },
  onHover: {
    self: {
      background: rgba(0, 0, 0, 0.01)
    }
  }
};

let TrackItem = React.createClass({

  render() {
    let {track, hover, ...props} = this.props;
    let style = {
      ...TrackItemStyle.self,
      ...(hover && TrackItemStyle.onHover.self)
    };
    return (
      <HBox {...props} style={style} onClick={this.onClick}>
        <CoverArtWithIcon
          style={TrackItemStyle.cover}
          size={TrackItemStyle.self.height}
          track={track}
          icon="play"
          onClick={this.onCoverClick}
          />
        <VBox style={TrackItemStyle.meta}>
          <VBox style={TrackItemStyle.name}>
            {track.get('name')}
          </VBox>
          <VBox style={TrackItemStyle.artist}>
            {track.get('artist')}
          </VBox>
        </VBox>
      </HBox>
    );
  },

  getDefaultProps() {
    return {
      onClick: Actions.uiPlay,
      onCoverClick: Actions.uiPlay
    };
  },

  onClick(e) {
    let {onClick, track} = this.props;
    onClick(track);
  },

  onCoverClick(e) {
    e.stopPropagation();
    let {onCoverClick, track} = this.props;
    onCoverClick(track);
  }
});

TrackItem = Hoverable(TrackItem);

let CoverArtWithIconStyle = {
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: rgba(0, 0, 0, 0.3),
    color: rgba(255, 255, 255, 0.6),
    alignItems: 'center',
    fontSize: 22,
    justifyContent: 'center',
    cursor: 'pointer'
  }
};

let CoverArtWithIcon = React.createClass({

  render() {
    let {size, icon, track, hover, ...props} = this.props;
    return (
      <VBox {...props}>
        <CoverArt size={size} track={track} />
        {hover &&
          <VBox style={CoverArtWithIconStyle.overlay}>
            <Icon name={icon} />
          </VBox>}
      </VBox>
    );
  },

  getDefaultProps() {
    return {
      icon: 'play'
    };
  }
});

CoverArtWithIcon = Hoverable(CoverArtWithIcon);

export default TrackItem;
