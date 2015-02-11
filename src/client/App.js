import 'normalize.css/normalize.css';
import './fonts/Roboto/index.css';
import React from 'react';
import SocketIO from 'socket.io-client';
import Immutable from 'immutable';
import debug from 'debug';
import Player from './Player';
import DropZone from './DropZone';
import Workspace from './Workspace';
import {reader, writer} from '../serialization';
import {VBox} from './Layout';
import {boxShadow, rgba, border} from './StyleUtils';
import Dispatcher from '../Dispatcher';
import LibraryStore from '../LibraryStore';
import {DragDropMixin, NativeDragItemTypes} from 'react-dnd';
import {addFile} from '../Actions'
import ActionTypes from '../ActionTypes';
import UiStore from './UiStore';
import StateFromStore from '../StateFromStore';
import {uiSetConnected} from '../Actions';

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

  mixins: [require('./Pure'), StateFromStore(UiStore), DragDropMixin],

  statics: {
    configureDragDrop(registerType) {
      registerType(NativeDragItemTypes.FILE, {
        dropTarget: {
          acceptDrop(component, item) {
            item.files.map(_ => addFile(_.path));
          }
        }
      });
    }
  },

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

  onConnect() {
    this._socket.emit('client');
    uiSetConnected(true);
  },

  onDisconnect() {
    uiSetConnected(false);
  },

  onDispatchAction(action) {
    action = reader.read(action);
    Dispatcher.dispatch(action);
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
        this._socket.emit('dispatch-action', writer.write(action));
      }
    });
  },

  render() {
    const drawUi = this.state.UiStore.connected && this.state.UiStore.ready;
    const fileDropState = this.getDropState(NativeDragItemTypes.FILE);
    return (
      <VBox style={AppStyle.self} {...this.dropTargetFor(NativeDragItemTypes.FILE)}>
        {drawUi && fileDropState.isDragging && <DropZone />}
        {drawUi && <Player style={AppStyle.player} />}
        {drawUi && <Workspace style={AppStyle.workspace} />}
        {!drawUi && <div style={AppStyle.splash} />}
      </VBox>
    );
  }

});

module.exports = App;
