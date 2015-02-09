import React from 'react';
import Browser from './Browser';
import {VBox, HBox} from './Layout';
import {border, boxShadow, rgba} from './StyleUtils';
import {colors} from './Theme';
import Home from './Home';
import Settings from './Settings';
import {Menu, MenuSeparator} from './Menu';

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

  render() {
    let {style, ...props} = this.props;
    let {activeScreen} = this.state;
    return (
      <HBox {...props} style={{...WorkspaceStyle.self, ...style}}>
        <VBox style={WorkspaceStyle.sidebar}>
          <Menu
            items={SCREENS}
            active={activeScreen}
            onActive={this.onActiveScreen}
            />
          <MenuSeparator>Recent</MenuSeparator>
          <MenuSeparator>Party</MenuSeparator>
        </VBox>
        <VBox style={WorkspaceStyle.main}>
          {activeScreen === 'home' && <Home />}
          {activeScreen === 'browser' && <Browser />}
          {activeScreen === 'settings' && <Settings />}
        </VBox>
      </HBox>
    )
  },

  getInitialState() {
    return {activeScreen: 'browser'};
  },

  onActiveScreen(activeScreen) {
    this.setState({activeScreen});
  }

});

module.exports = Workspace;
