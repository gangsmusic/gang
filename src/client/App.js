var React = require('react');
var SocketIO = require('socket.io-client');
var Immutable = require('immutable');
var debugState = require('debug')('gang:state');
var debugDispatch = require('debug')('gang:dispatch');

var Player = require('./Player');
var StatusBar = require('./StatusBar');
var Workspace = require('./Workspace');


require('./App.styl');

var emptyState = require('../shared/emptyState');

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

  getChildContext() {
    return {
      dispatcher: {
        dispatch: this.dispatch,
        state: this.state.serverState
      }
    };
  },

  getInitialState() {
    return {
      connected: false,
      serverState: emptyState
    };
  },

  onConnect() {
    this.setState({
      connected: true,
      serverState: emptyState
    });
  },

  onDisconnect() {
    this.setState({
      connected: false,
      serverState: emptyState
    });
  },

  onState(data) {
    var serverState = (this._pendingState || this.state).serverState.mergeDeep(data);
    debugState('', serverState.toJS());
    this.setState({
      serverState: serverState
    });
  },

  componentDidMount() {
    this._socket = SocketIO.connect('http://' + window.location.hostname + ':3001');
    this._socket.on('connect', this.onConnect);
    this._socket.on('disconnect', this.onDisconnect);
    this._socket.on('state', this.onState);
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
