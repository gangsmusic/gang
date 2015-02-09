import React from 'react';
import {border, boxShadow, rgba} from './StyleUtils';
import {HBox, VBox} from './Layout';
import Menu from './Menu';
import TextInput from './TextInput';

const SettingsStyle = {
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
    width: 250
  },
  menu: {
    paddingTop: 10
  }
};

const SCREENS = [
  {
    id: 'profile',
    title: 'Profile',
    icon: 'user'
  },
  {
    id: 'audio',
    title: 'Audio',
    icon: 'volume-up'
  },
  {
    id: 'itunes',
    title: 'iTunes',
    icon: 'apple'
  },
  {
    id: 'soundcloud',
    title: 'SoundCloud',
    icon: 'soundcloud'
  },
  {
    id: 'spotify',
    title: 'Spotify',
    icon: 'spotify'
  }
];

let Settings = React.createClass({

  render() {
    let {activeScreen} = this.state;
    return (
      <HBox style={SettingsStyle.self}>
        <VBox style={SettingsStyle.sidebar}>
          <Menu
            style={SettingsStyle.menu}
            items={SCREENS}
            active={activeScreen}
            onActive={this.onActiveScreen}
            />
        </VBox>
        <VBox style={SettingsStyle.main}>
          {activeScreen === 'profile' && <ProfileSettings />}
        </VBox>
      </HBox>
    );
  },

  getInitialState() {
    return {
      activeScreen: 'profile'
    };
  },

  onActiveScreen(activeScreen) {
    this.setState({activeScreen});
  }
});

let ProfileSettingsStyle = {
  self: {
    padding: 10
  }
};

let ProfileSettings = React.createClass({

  render() {
    return (
      <VBox style={ProfileSettingsStyle.self}>
        <TextInput placeholder="Name" />
      </VBox>
    );
  }
});

export default Settings;
