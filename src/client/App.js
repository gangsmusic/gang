import 'normalize.css/normalize.css';
import './fonts/Roboto/index.css';
import React from 'react';
import SocketIO from 'socket.io-client';
import Immutable from 'immutable';
import debug from 'debug';
import emptyState from '../shared/emptyState';
import emptyLibrary from '../shared/emptyLibrary';
import actions from '../shared/actions';
import libraryUtils from '../shared/libraryUtils';
import Player from './Player';
import Workspace from './Workspace';
import {DISPATCHERS} from './GangComponent';
import {VBox} from './Layout';
import {boxShadow, rgba, border} from './StyleUtils';

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
  }
};

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
    this._socket.on('state', this.onState);
    this._socket.on('library', this.onLibrary);
    this._socket.on('action', this.onAction);
  },

  render() {
    var {connected} = this.state;
    return (
      <VBox style={AppStyle.self}>
        {connected && <Player style={AppStyle.player} />}
        {connected && <Workspace style={AppStyle.workspace} />}
      </VBox>
    );
  }

});


module.exports = App;
