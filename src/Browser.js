var React = require('react/lib/ReactWithAddons');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Immutable = require('immutable');
var debug = require('debug')('gang:browser');
var ListView = require('./ListView');

require('./Browser.styl');


var Item = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  onClick() {
    if (this.props.onClick) {
      this.props.onClick(this.props.item);
    }
  },

  render() {
    var {item, onClick, ...props} = this.props;
    return (
      <div className='Browser-Row' onClick={this.onClick} {...props}>
        {item.get('name')}
      </div>
    );
  }

});

var itemComponent = <Item />;

var AutoListView = React.createClass({

  getInitialState() {
    return {
      width: 0,
      height: 0
    };
  },

  onWindowResize() {
    if (this.isMounted()) {
      var {width, height} = this.getDOMNode().getBoundingClientRect();
      this.setState({width, height});
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
    var {className, ...tableProps} = this.props;
    tableProps.itemComponent = itemComponent;
    var table = (this.state.height && this.state.width) ? <ListView width={this.state.width} height={this.state.height - 24} {...tableProps} /> : null;
    return (
      <div className={className}>
        <div className='Browser-Section-Title'>{this.props.title}</div>
        {table}
      </div>
    );
  }

});


var Browser = React.createClass({

  mixins: [require('./GangComponent')],

  getInitialState() {
    return {
      artist: null
    };
  },

  onArtistClicked(artist) {
    if (artist.get('id') !== this.state.artist) {
      debug('select artist', artist.toString());
      this.setState({
        artist: artist.get('id')
      });
    }
  },

  onTrackClicked(track) {
    debug('select track', track.toString());
  },

  render() {
    var artists = Immutable.List(this.get(['library', 'artists']).values()).sortBy(x => x.get('name'));

    var tracks = Immutable.List(this.get(['library', 'tracks']).values());
    if (this.state.artist !== null) {
      tracks = tracks.filter(x => x.get('artist') === this.state.artist);
    }

    var albums = Immutable.List(this.get(['library', 'albums']).values());

    return (
      <div className='Browser'>
        <AutoListView className='Browser-Artists' title='Artists' itemHeight={24} onItemClick={this.onArtistClicked} items={artists} />
        <AutoListView className='Browser-Albums' title='Albums' itemHeight={24} items={albums} />
        <AutoListView className='Browser-Tracks' title='Tracks' itemHeight={24} onItemClick={this.onTrackClicked} items={tracks} />
      </div>
    );
  }

});

module.exports = Browser;
