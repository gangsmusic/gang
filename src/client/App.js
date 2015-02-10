import 'normalize.css/normalize.css';
import './fonts/Roboto/index.css';
import React from 'react';
import SocketIO from 'socket.io-client';
import Immutable from 'immutable';
import debug from 'debug';
import Player from './Player';
import Workspace from './Workspace';
import {VBox} from './Layout';
import {boxShadow, rgba, border} from './StyleUtils';
import Dispatcher from '../Dispatcher';
import LibraryStore from '../LibraryStore';
import ActionTypes from '../ActionTypes';

const debugState = debug('gang:state');
const debugAction = debug('gang:action');
const debugDispatch = debug('gang:dispatch');

const AppStyle = {
  self: {
    height: '100vh',
    fontWeight: 300,
    fontFamily: 'Roboto',
    fontSize: '16px',
    overflow: 'hidden',
    WebkitFontSmoothing: 'antialiased'
  },
  player: {
    zIndex: 1000,
    boxShadow: boxShadow(0, 1, 2, 2, rgba(0, 0, 0, 0.04))
  },
  workspace: {
    zIndex: 999
  },
  splash: {
    height: '100vh',
    background: `url(${require('./img/splash.png')}) center/256px 256px no-repeat`
  }
};

var App = React.createClass({

  mixins: [require('./Pure')],

  childContextTypes: {
    dispatch: React.PropTypes.func.isRequired
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
      dispatch: this.dispatch
    };
  },

  getInitialState() {
    return {
      connected: false,
      initialized: false
    };
  },

  onConnect() {
    this._socket.emit('client');
    this.setState({
      connected: true
    });
  },

  onDisconnect() {
    this.setState({
      connected: false
    });
  },

  onDispatchAction(action) {
    Dispatcher.dispatch(action);
    if (action.type === ActionTypes.BOOTSTRAP_STORES) {
      this.setState({
        initialized: true
      });
    }
  },

  componentDidMount() {
    const ioPort = parseInt(window.location.search.slice(1), 10);
    var url;
    if (window.location.protocol === 'file:') {
      url = 'http://127.0.0.1:' + ioPort;
    } else {
      url = 'http://' + window.location.hostname + ':' + ioPort;
    }
    this._socket = SocketIO.connect(url);
    this._socket.on('connect', this.onConnect);
    this._socket.on('disconnect', this.onDisconnect);
    this._socket.on('dispatch-action', this.onDispatchAction);
    Dispatcher.register(action => {
      if (action.origin === 'client') {
        this._socket.emit('dispatch-action', action);
      }
    });
  },

  render() {
    const {connected, initialized} = this.state;
    const drawUi = connected && initialized;
    return (
      <VBox style={AppStyle.self}>
        {drawUi && <Player style={AppStyle.player} />}
        {drawUi && <Workspace style={AppStyle.workspace} />}
        {!drawUi && <div style={AppStyle.splash} />}
      </VBox>
    );
  }

});


module.exports = App;
