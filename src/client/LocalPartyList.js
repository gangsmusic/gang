import React from 'react';

import LocalPartyStore from '../LocalPartyStore';
import StateFromStore from '../StateFromStore';

import {Menu} from './Menu';
import {VBox, HBox} from './Layout';

let LocalPartyMemberStyle = {
  self: {
    flex: 1
  },
  name: {
  },
  nowPlaying: {
    color: '#AAA',
    fontSize: 12,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  nowPlayingName: {
    marginRight: 3
  },
  nowPlayingArtist: {
    marginLeft: 3
  }
};

let LocalPartyMember = React.createClass({

  render() {
    let {name, nowPlaying, style, ...props} = this.props;
    let trackName = nowPlaying ? 
      `${nowPlaying.get('name')} by ${nowPlaying.get('artist')}` :
      null;
    return (
      <VBox {...props} style={{...LocalPartyMemberStyle.self, ...style}}>
        <VBox style={LocalPartyMemberStyle.name}>
          {name}
        </VBox>
        {nowPlaying &&
          <div style={LocalPartyMemberStyle.nowPlaying} title={trackName}>
            {trackName}
          </div>}
      </VBox>
    );
  }
});

let LocalPartyList = React.createClass({
  mixins: [StateFromStore(LocalPartyStore)],

  render() {
    // XXX: we don't need .toArray() when we are on React 0.13
    let items = this.state.LocalPartyStore.map(item => ({
      id: item.name,
      icon: item.nowPlaying ? 'music' : 'user',
      title: (
        <LocalPartyMember
          name={item.name}
          nowPlaying={item.nowPlaying}
          />
      )
    })).toArray();
    return (
      <Menu
        items={items}
        />
    );
  }
});

export default LocalPartyList;
