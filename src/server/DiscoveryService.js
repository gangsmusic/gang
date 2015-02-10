import {hostname} from 'os';
import debug from 'debug';
import {checkPortStatus} from 'portscanner';
import Service from './Service';
import {Discovery, Announce} from './discovery';
import {localPartyParticipantAdded, localPartyParticipantRemoved} from '../Actions';
import LocalPartyStore from '../LocalPartyStore';

const log = debug('gang:DiscoveryService');

class DiscoveryService extends Service {

  constructor(config) {
    super(config);
    this._discovery = null;
    this._announce = null;
  }

  didStart() {
    this._announce = new Announce(hostname(), 12001);
    this._discovery = new Discovery();
    this._discovery.addChangeListener(this._onChange.bind(this));
    this._checkLivenessTimer = setInterval(this._onCheckLiveness.bind(this), 5000);
  }

  willStop() {
    this._announce.stop();
    this._discovery.stop();
    this._announce = null;
    this._discovery = null;
    clearInterval(this._checkLivenessTimer);
  }

  _onChange({name, host, port}) {
    this._checkLiveness(name, host, port);
  }

  _onCheckLiveness() {
    log('initiating regular check for liveness');
    LocalPartyStore.getState().forEach(({name, host, port}) => {
      this._checkLiveness(name, host, port, true);
    });
  }

  _checkLiveness(name, host, port, removeOnly = false) {
    log(`checking ${host}:${port}`);
    checkPortStatus(port, host, (error, open) => {
      log(`result for ${host}:${port}: ${open}`);
      if (error) {
        log('checking port status resulted in error', error);
        open = 'closed';
      }
      if (open === 'open') {
        if (!removeOnly) {
          localPartyParticipantAdded(name, host, port);
        }
      } else {
        localPartyParticipantRemoved(name, host, port);
      }
    });
  }
}

export default DiscoveryService;
