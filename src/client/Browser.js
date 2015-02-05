var React = require('react/lib/ReactWithAddons');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Immutable = require('immutable');
var debug = require('debug')('gang:browser');
var ListView = require('./ListView');
var Pure = require('./Pure');

require('./Browser.styl');


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
    var {item, onClick, ...props} = this.props;
    var className = React.addons.classSet({
      'Browser-Row': true,
      'Browser-Row--selected': this.props.selected
    });
    return (
      <div className={className} onClick={this.onClick} {...props}>
        {typeof item === 'string' ? item : item.get('name')}
      </div>
    );
  }

});

var AutoListView = React.createClass({

  mixins: [Pure],

  getDefaultProps() {
    return {
      itemComponent: <Item />
    };
  },

  getInitialState() {
    return {
      height: 0
    };
  },

  onWindowResize() {
    if (this.isMounted()) {
      var {height} = this.getDOMNode().getBoundingClientRect();
      this.setState({height});
    }
  },

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  },

  render() {
    var {className, ...listProps} = this.props;
    var table = this.state.height ? <ListView height={this.state.height - 24} {...listProps} /> : null;
    return (
      <div className={className}>
        <div className='Browser-Section-Title'>{this.props.title}</div>
        {table}
      </div>
    );
  }

});


function distinct(collection, key) {
  return collection.map(x => x.get(key)).toOrderedSet().toList().filter(x => typeof x === 'string');
}


var Browser = React.createClass({

  mixins: [require('./GangComponent')],

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
    var tracks = this.getLibrary();
    var artists = distinct(tracks, 'artist').sortBy();

    if (this.state.artist) {
      tracks = tracks.filter(x => x.get('artist') === this.state.artist);
    }

    var albums = distinct(tracks, 'album').sortBy();
    if (this.state.album) {
      tracks = tracks.filter(x => x.get('album') === this.state.album);
    }

    return (
      <div className='Browser'>
        <AutoListView className='Browser-Artists' title='Artists' itemHeight={24} selectedItem={this.state.artist} onItemClick={this.onArtistClicked} items={artists} />
        <AutoListView className='Browser-Albums' title='Albums' itemHeight={24} selectedItem={this.state.album} onItemClick={this.onAlbumClicked} items={albums} />
        <AutoListView className='Browser-Tracks' title='Tracks' itemHeight={24} onItemClick={this.onTrackClicked} items={tracks} />
      </div>
    );
  }

});

module.exports = Browser;
