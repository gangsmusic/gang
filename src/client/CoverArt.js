import React from 'react';
import {VBox} from './Layout';
import {backgroundImage} from './StyleUtils';

let CoverArt = React.createClass({

  render() {
    let {track, size, ...props} = this.props;
    let style = {
      ...backgroundImage(coverArtURLForTrack(track)),
      width: size,
      height: size
    };
    return <VBox style={style} />;
  },

  getDefaultProps() {
    return {
      size: 64
    };
  }
});

export function coverArtURLForTrack(track) {
  return `http://localhost:12003/cover?url=${track.get('url')}`;
}

export default CoverArt;
