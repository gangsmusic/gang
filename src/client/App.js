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


require('./App.styl');


var App = React.createClass({

  childContextTypes: {
    dispatcher: require('./DispatcherShape')
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
      dispatcher: {
        dispatch: this.dispatch,
        execute: this.execute,
        state: this.state.serverState,
        library: this.state.library
      }
    };
  },

  getInitialState() {
    return {
      connected: false,
      serverState: emptyState,
      library: emptyLibrary
    };
  },

  onConnect() {
    this.setState({
      connected: true,
      serverState: emptyState,
      library: emptyLibrary
    });
  },

  onDisconnect() {
    this.setState({
      connected: false,
      serverState: emptyState
    });
  },

  onState(data) {
    debugState('', data);
    var serverState = (this._pendingState || this.state).serverState.mergeDeep(data);
    this.setState({serverState});
  },

  onLibrary({name, payload}) {
    const oldLibrary = (this._pendingState || this.state).library;
    const utilFn = libraryUtils[name];
    if (!utilFn) {
      throw new Error(`unknown library util function ${name}`);
    }
    const library = utilFn(payload, oldLibrary);
    if (!Immutable.is(oldLibrary, library)) {
      this.setState({library});
    }
  },

  onAction(name) {
    var serverState = actions[name]((this._pendingState || this.state).serverState);
    debugAction(name);
    this.setState({serverState});
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
