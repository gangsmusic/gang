import React from 'react';

import * as Actions from '../Actions';
import RecentPlayedTracksStore from '../RecentPlayedTracksStore';
import StateFromStore from '../StateFromStore';

import {Menu} from './Menu';
import {VBox, HBox} from './Layout';

let RecentTracksListStyle = {
  track: {
    
  },
  artist: {
    fontSize: 12,
    fontWeight: 'normal'
  }
};

let RecentTracksList = React.createClass({
  mixins: [StateFromStore(RecentPlayedTracksStore)],

  render() {
    let items = this.state.RecentPlayedTracksStore.reverse().map(item => ({
      id: item.get('name'),
      icon: 'music',
      onClick: Actions.uiPlay.bind(null, item),
      title: (
        <VBox>
          <VBox style={RecentTracksListStyle.track}>{item.get('name')}</VBox>
          <VBox style={RecentTracksListStyle.artist}>{item.get('artist')}</VBox>
        </VBox>
      )
    })).toArray();
    return (
      <Menu
        items={items}
        />
    );
  }
});

export default RecentTracksList;
