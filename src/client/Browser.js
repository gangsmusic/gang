import React from 'react/lib/ReactWithAddons';
import Immutable from 'immutable';
import debug from 'debug'
import ListView from './ListView';
import Pure from './Pure';
import {VBox, HBox} from './Layout';
import {rgba, border, borderStyle, boxShadow} from './StyleUtils';
import {colors} from './Theme';

const debugBrowser = debug('gang:browser');

const ItemStyle = {
  self: {
    padding: '0 8px',
    fontSize: '90%',
    lineHeight: '23px',
    boxShadow: boxShadow(0, 1, 0, 0, '#F9F9F9'),
    cursor: 'pointer',
    WebkitUserSelect: 'none',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  onSelected: {
    self: {
      background: colors.selected,
      color: colors.selectedText,
      fontWeight: 'bold'
    }
  }
}

var Item = React.createClass({

  propTypes: {
    item: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(Immutable.Map)
    ]).isRequired,
    selected: React.PropTypes.bool,
    onClick: React.PropTypes.func
  },

  mixins: [Pure],

  onClick() {
    if (this.props.onClick) {
      if (this.props.selected) {
        this.props.onClick(null);
      } else {
        this.props.onClick(this.props.item);
      }
    }
  },

  render() {
    var {item, onClick, selected, ...props} = this.props;
    return (
      <div {...props} style={{...ItemStyle.self, ...(selected && ItemStyle.onSelected.self)}} onClick={this.onClick}>
        {typeof item === 'string' ? item : item.get('name')}
      </div>
    );
  }

});


const AutoListViewStyle = {
  self: {
    flex: 1
  },
  title: {
    lineHeight: '23px',
    textIndent: '8px',
    fontWeight: 'bold',
    fontSize: '80%',
    color: colors.fadedText,
    background: colors.background,
    borderBottom: border(1, borderStyle.solid, '#ccc'),
    borderTop: border(1, borderStyle.solid, '#ccc')
  }
};


var AutoListView = React.createClass({

  mixins: [Pure, require('./LayoutMixin')],

  getDefaultProps() {
    return {
      itemComponent: <Item />
    };
  },

  render() {
    var {style, ...listProps} = this.props;
    var table = this.state.height ? <ListView height={this.state.height - 24} {...listProps} /> : null;
    return (
      <VBox style={{...AutoListViewStyle.self, ...style}}>
        <div style={AutoListViewStyle.title}>{this.props.title}</div>
        {table}
      </VBox>
    );
  }

});


function distinct(collection, key) {
  return collection.map(x => x.get(key)).toOrderedSet().toList().filter(x => typeof x === 'string');
}

const BrowserStyle = {
  self: {
    flex: 1
  },
  top: {
    flex: 1
  },
  bottom: {
    flex: 1
  },
  artists: {
    borderRight: border(1, borderStyle.solid, '#ccc')
  }
};

var Browser = React.createClass({

  mixins: [require('./GangComponent').Mixin],

  statics: {
    observe: {
      library: ['tracks']
    }
  },

  getInitialState() {
    return {
      artist: null,
      album: null
    };
  },

  onArtistClicked(artist) {
    debugBrowser('select artist', artist);
    this.setState({
      artist,
      album: null
    });
  },

  onAlbumClicked(album) {
    debugBrowser('select album', album);
    this.setState({album})
  },

  onTrackClicked(track) {
    debugBrowser('select track', track.toString());
    this.dispatch('play', track);
  },

  render() {
    var tracks = this.state.library_tracks;
    var artists = distinct(tracks, 'artist').sortBy();

    if (this.state.artist) {
      tracks = tracks.filter(x => x.get('artist') === this.state.artist);
    }

    var albums = distinct(tracks, 'album').sortBy();
    if (this.state.album) {
      tracks = tracks.filter(x => x.get('album') === this.state.album);
    }

    return (
      <VBox style={BrowserStyle.self}>
        <HBox style={BrowserStyle.top}>
          <AutoListView
            style={BrowserStyle.artists}
            title="Artists"
            itemHeight={24}
            selectedItem={this.state.artist}
            onItemClick={this.onArtistClicked}
            items={artists}
            />
          <AutoListView
            title="Albums"
            itemHeight={24}
            selectedItem={this.state.album}
            onItemClick={this.onAlbumClicked}
            items={albums}
            />
        </HBox>
        <VBox style={BrowserStyle.bottom}>
          <AutoListView title='Tracks' itemHeight={24} onItemClick={this.onTrackClicked} items={tracks} />
        </VBox>
      </VBox>
    );
  }

});

module.exports = Browser;
