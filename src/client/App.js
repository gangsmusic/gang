const React = require('react');
const SocketIO = require('socket.io-client');
const Immutable = require('immutable');
const debugState = require('debug')('gang:state');
const debugAction = require('debug')('gang:action');
const debugDispatch = require('debug')('gang:dispatch');

const Player = require('./Player');
const StatusBar = require('./StatusBar');
const Workspace = require('./Workspace');
const emptyState = require('../shared/emptyState');
const emptyLibrary = require('../shared/emptyLibrary');
const actions = require('../shared/actions');
const libraryUtils = require('../shared/libraryUtils');
const {DISPATCHERS} = require('./GangComponent');


require('./App.styl');


var App = React.createClass({

  mixins: [require('./Pure')],

  childContextTypes: {
    dispatch: React.PropTypes.func.isRequired,
    execute: React.PropTypes.func.isRequired
  },

  dispatch(ev, data) {
    debugDispatch(ev, data);
    this._socket.emit('event', {
      type: ev,
      payload: data
    });
  },

  execute(name) {
    debugDispatch('action', name);
    this._socket.emit('event', {
      type: 'action',
      payload: name
    });
  },

  getChildContext() {
    return {
      dispatch: this.dispatch,
      execute: this.execute
    };
  },

  getInitialState() {
    return {
      connected: false
    };
  },

  onConnect() {
    this.setState({
      connected: true
    });
  },

  onDisconnect() {
    this.setState({
      connected: false
    });
    DISPATCHERS.player.data = require('../shared/emptyState');
    DISPATCHERS.library.data = require('../shared/emptyLibrary');
  },

  onState(data) {
    debugState('', data);
    DISPATCHERS.player.data = DISPATCHERS.player.data.mergeDeep(data);
  },

  onLibrary({name, payload}) {
    const oldLibrary = DISPATCHERS.library.data;
    const utilFn = libraryUtils[name];
    if (!utilFn) {
      throw new Error(`unknown library util function ${name}`);
    }
    const library = utilFn(payload, oldLibrary);
    if (!Immutable.is(oldLibrary, library)) {
      DISPATCHERS.library.data = library;
    }
  },

  onAction(name) {
    debugAction(name);
    DISPATCHERS.player.data = actions[name](DISPATCHERS.player.data);
  },

  componentDidMount() {
    this._socket = SocketIO.connect('http://' + window.location.hostname + ':3001');
    this._socket.on('connect', this.onConnect);
    this._socket.on('disconnect', this.onDisconnect);
    this._socket.on('state', this.onState);
    this._socket.on('library', this.onLibrary);
    this._socket.on('action', this.onAction);
  },

  renderDisconnected() {
    return (
      <div className='App'>
      </div>
    );
  },

  renderConnected() {
    return (
      <div className='App'>
        <Player />
        <Workspace />
        <StatusBar />
      </div>
    );
  },

  render() {
    return this.state.connected ? this.renderConnected() : this.renderDisconnected();
  }

});


module.exports = App;
