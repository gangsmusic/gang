var React = require('react/lib/ReactWithAddons');
var Immutable = require('immutable');
var debug = require('debug')('gang:browser');
var ListView = require('./ListView');
var Pure = require('./Pure');
import {Box, HBox} from './Box';
import {rgba, border, borderStyle} from './StyleUtils';

const ItemStyle = {
  self: {
    padding: '0 8px',
    lineHeight: '23px',
    borderBottom: border(1, borderStyle.solid, '#ccc'),
    cursor: 'pointer',
    WebkitUserSelect: 'none',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  onSelected: {
    self: {
      background: rgba(0, 0, 255, 0.2)
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
    background: rgba(0, 0, 0, 0.1),
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
      <Box style={{...AutoListViewStyle.self, ...style}}>
        <div style={AutoListViewStyle.title}>{this.props.title}</div>
        {table}
      </Box>
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
    debug('select artist', artist);
    this.setState({
      artist,
      album: null
    });
  },

  onAlbumClicked(album) {
    debug('select album', album);
    this.setState({album})
  },

  onTrackClicked(track) {
    debug('select track', track.toString());
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
      <Box style={BrowserStyle.self}>
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
        <Box style={BrowserStyle.bottom}>
          <AutoListView title='Tracks' itemHeight={24} onItemClick={this.onTrackClicked} items={tracks} />
        </Box>
      </Box>
    );
  }

});

module.exports = Browser;
