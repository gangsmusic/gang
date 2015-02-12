import React from 'react';
import Browser from './Browser';
import {VBox, HBox} from './Layout';
import {border, boxShadow, rgba} from './StyleUtils';
import {colors} from './Theme';
import Home from './Home';
import Settings from './Settings';
import {Menu, MenuSeparator} from './Menu';
import StateFromStore from '../StateFromStore';
import LocalPartyStore from '../LocalPartyStore';
import UiStore from './UiStore';
import {uiChangeScreen} from '../Actions';

const SCREENS = [
  {
    id: 'home',
    title: 'Home',
    icon: 'home'
  },
  {
    id: 'browser',
    title: 'Browser',
    icon: 'music'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'cogs'
  }
];

const WorkspaceStyle = {
  self: {
    flex: 1
  },
  main: {
    flex: 1,
    boxShadow: boxShadow(-1, 0, 2, 2, rgba(0, 0, 0, 0.04))
  },
  sidebar: {
    background: rgba(0, 0, 0, 0.01),
    overflow: 'scroll',
    width: 250,
    paddingTop: 10
  }
};

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

let LocalParty = React.createClass({
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

let Workspace = React.createClass({

  mixins: [StateFromStore(UiStore)],

  render() {
    let {style, ...props} = this.props;
    let {activeScreen} = this.state.UiStore;
    return (
      <HBox {...props} style={{...WorkspaceStyle.self, ...style}}>
        <VBox style={WorkspaceStyle.sidebar}>
          <Menu
            items={SCREENS}
            active={activeScreen}
            onActive={this.onActiveScreen}
            />
          <MenuSeparator>Recent</MenuSeparator>
          <MenuSeparator>Local Party</MenuSeparator>
          <LocalParty />
        </VBox>
        <VBox style={WorkspaceStyle.main}>
          {activeScreen === 'home' && <Home />}
          {activeScreen === 'browser' && <Browser />}
          {activeScreen === 'settings' && <Settings />}
        </VBox>
      </HBox>
    )
  },

  onActiveScreen(activeScreen) {
    uiChangeScreen(activeScreen);
  }

});

module.exports = Workspace;
