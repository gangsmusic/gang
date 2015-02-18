import React from 'react/lib/ReactWithAddons';
import * as Actions from '../Actions';
import emptyFunction from '../emptyFunction';
import SearchStore from '../SearchStore';
import StateFromStore from '../StateFromStore';
import RecentPlayedTracksStore from '../RecentPlayedTracksStore';
import {rgba, border} from './StyleUtils';
import {VBox, HBox} from './Layout';
import IconButton from './IconButton';
import Icon from './Icon';
import {colors} from './Theme';
import SearchTextInput from './SearchTextInput';
import CardBase from './CardBase';
import Card from './Card';
import TrackItem from './TrackItem';

const HomeStyle = {
  self: {
    padding: 10,
    flex: 1,
    background: rgba(0, 0, 0, 0.01),
    overflowX: 'auto'
  }
};

let HomeCardStyle = {
  self: {
    width: 360
  },
  searchInput: {
    marginBottom: 10
  }
};

let HeaderItemStyle = {
  self: {
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 2,
    paddingLeft: 5,
    marginBottom: 5,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.fadedText,
    textTransform: 'uppercase',
    borderBottom: border(1, border.style.solid, rgba(0, 0, 0, 0.1))
  }
};

let HeaderItem = React.createClass({

  render() {
    let {children, ...props} = this.props;
    return <VBox {...props} style={HeaderItemStyle.self}>{children}</VBox>;
  }
});

let HomeCard = React.createClass({
  mixins: [StateFromStore(SearchStore, RecentPlayedTracksStore)],

  render() {
    let {query, results} = this.state.SearchStore;
    let isSearch = query !== '';
    return (
      <CardBase style={HomeCardStyle.self}>
        <SearchTextInput
          style={HomeCardStyle.searchInput}
          value={query}
          onChange={Actions.search}
          />
        {isSearch && results
          .map(track => <TrackItem track={track} />)
          .toArray()}
        {!isSearch && <HeaderItem>Recent tracks</HeaderItem>}
        {!isSearch && this.state.RecentPlayedTracksStore
          .reverse()
          .map(track => <TrackItem track={track} />)
          .toArray()}
      </CardBase>
    );
  }
});

let TrackCard = React.createClass({
  render() {
    let {track} = this.props;
    return (
      <Card>
        <CoverArt track={track} size="100%" />
      </Card>
    );
  }
});

let Home = React.createClass({

  render() {
    let {style, ...props} = this.props;
    return (
      <HBox {...props} style={{...HomeStyle.self, ...style}}>
        <HomeCard />
      </HBox>
    );
  }
});

export default Home;
