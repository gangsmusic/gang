import SocketIO from 'socket.io-client';
import Immutable from 'immutable';
import {hostname} from 'os';
import debug from 'debug';
import {checkPortStatus} from 'portscanner';
import Service from './Service';
import {Discovery, Announce} from './discovery';
import {localPartyParticipantAdded, localPartyParticipantRemoved} from '../Actions';
import LocalPartyStore from '../LocalPartyStore';
import ActionTypes from '../ActionTypes';
import {remoteAction} from '../Actions';

const log = debug('gang:DiscoveryService');

class DiscoveryService extends Service {

  constructor(config) {
    super(config);
    this._discovery = null;
    this._announce = null;
    this._sockets = Immutable.Map();
  }

  didStart() {
    this._announce = new Announce(hostname(), 12001);
    this._discovery = new Discovery();
    this._discovery.addChangeListener(this._onChange.bind(this));
  }

  willStop() {
    this._announce.stop();
    this._discovery.stop();
    this._announce = null;
    this._discovery = null;
  }

  _onChange({name, host, port}) {
    // for the time being
    name = host;
    let socket = SocketIO.connect(`http://${host}:${port}`);
    socket.on('connect', this._onSocketConnect.bind(this, name, socket));
    socket.on('disconnect', this._onSocketDisconnect.bind(this, name, socket));
    socket.on('dispatch-action', this._onSocketDispatchAction.bind(this, name));
    this._sockets = this._sockets.set(name, socket);
  }

  _onSocketConnect(name, socket) {
    socket.emit('server', name);
    localPartyParticipantAdded(name);
  }

  _onSocketDisconnect(name, socket) {
    localPartyParticipantRemoved(name);
    this._sockets = this._sockets.remove(name);
  }

  _onSocketDispatchAction(name, action) {
    remoteAction(action, name);
  }
}

export default DiscoveryService;
