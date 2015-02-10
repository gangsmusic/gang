import debug from 'debug';
import portscanner from 'portscanner';
import Service from './Service';
import {Discovery, Announce} from './discovery';
import {localPartyParticipantAdded, localPartyParticipantRemoved} from '../Actions';

const log = debug('gang:DiscoveryService');

class DiscoveryService extends Service {

  constructor(config) {
    super(config);
    this._discovery = null;
    this._announce = null;
  }

  didStart() {
    this._announce = new Announce('wooops', 12001);
    this._discovery = new Discovery();
    this._discovery.addChangeListener(this._onChange);
  }

  willStop() {
    this._announce.stop();
    this._discovery.stop();
    this._announce = null;
    this._discovery = null;
  }

  _onChange({name, host, port}) {
    localPartyParticipantAdded(name, host, port);
  }
}

export default DiscoveryService;
