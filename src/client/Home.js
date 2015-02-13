import React from 'react/lib/ReactWithAddons';
import * as Actions from '../Actions';
import emptyFunction from '../emptyFunction';
import SearchStore from '../SearchStore';
import StateFromStore from '../StateFromStore';
import Hoverable from './Hoverable';
import {rgba, boxShadow} from './StyleUtils';
import {VBox, HBox} from './Layout';
import IconButton from './IconButton';
import Icon from './Icon';
import SearchTextInput from './SearchTextInput';

const CardBaseStyle = {
  self: {
    overflowX: 'hidden',
    overflowY: 'auto',
    minWidth: 360,
    marginRight: 10,
  }
};

let CardBase = React.createClass({

  render() {
    let {style, children, ...props} = this.props;
    return (
      <VBox {...props} style={{...CardBaseStyle.self, ...style}}>
        {children}
      </VBox>
    );
  }
});

let CardStyle = {
  self: {
    boxShadow: boxShadow(0, 0, 2, 3, rgba(0, 0, 0, 0.01)),
    background: rgba(255, 255, 255, 1)
  }
};

let Card = React.createClass({

  render() {
    let {style, children, ...props} = this.props;
    return (
      <CardBase {...props} style={{...CardStyle.self, ...style}}>
        {children}
      </CardBase>
    );
  }
});


const HomeStyle = {
  self: {
    padding: 10,
    flex: 1,
    background: rgba(0, 0, 0, 0.01),
    overflowX: 'auto'
  }
};

let SearchResultItemStyle = {
  self: {
    color: rgba(0, 0, 0, 0.6),
    cursor: 'pointer'
  },
  meta: {
    margin: '10px 0px'
  },
  name: {
    fontWeight: 'bold'
  },
  artist: {
    fontSize: 12,
    fontWeight: 'normal'
  },
  iconWrapper: {
    padding: '0px 15px',
    justifyContent: 'center'
  },
  onHover: {
    self: {
      background: rgba(0, 0, 0, 0.01)
    }
  }
};

let SearchResultItem = React.createClass({

  render() {
    let {track, hover, ...props} = this.props;
    let style = {
      ...SearchResultItemStyle.self,
      ...(hover && SearchResultItemStyle.onHover.self)
    };
    return (
      <HBox {...props} style={style}>
        <VBox style={SearchResultItemStyle.iconWrapper}>
          <Icon name="music" />
        </VBox>
        <VBox style={SearchResultItemStyle.meta}>
          <VBox style={SearchResultItemStyle.name}>
            {track.get('name')}
          </VBox>
          <VBox style={SearchResultItemStyle.artist}>
            {track.get('artist')}
          </VBox>
        </VBox>
      </HBox>
    );
  }
});

SearchResultItem = Hoverable(SearchResultItem);

let SearchCardStyle = {
  self: {
    width: 360
  }
};

let SearchCard = React.createClass({
  mixins: [StateFromStore(SearchStore)],

  render() {
    let {query, results} = this.state.SearchStore;
    return (
      <CardBase style={SearchCardStyle.self}>
        <SearchTextInput
          value={query}
          onChange={this.onSearch}
          />
        {results.map(result =>
          <SearchResultItem
            track={result}
            onClick={this.onResultClick.bind(null, result)}
            />).toArray()}
      </CardBase>
    );
  },

  onResultClick(track) {
    Actions.uiPlay(track);
  },

  onSearch(query) {
    Actions.search(query); 
  }
});

let Home = React.createClass({

  render() {
    let {style, ...props} = this.props;
    return (
      <HBox {...props} style={{...HomeStyle.self, ...style}}>
        <Card>
        </Card>
        <SearchCard />
      </HBox>
    );
  }
});

export default Home;
