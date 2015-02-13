import React from 'react';
import Browser from './Browser';
import {VBox, HBox} from './Layout';
import {border, boxShadow, rgba} from './StyleUtils';
import {colors} from './Theme';
import Home from './Home';
import Settings from './Settings';
import {Menu, MenuSeparator} from './Menu';
import StateFromStore from '../StateFromStore';
import UiStore from './UiStore';
import {uiChangeScreen} from '../Actions';
import LocalPartyList from './LocalPartyList';
import RecentPlayedTracksList from './RecentPlayedTracksList';

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
          <MenuSeparator>Local Party</MenuSeparator>
          <LocalPartyList />
          <MenuSeparator>Recent</MenuSeparator>
          <RecentPlayedTracksList />
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
