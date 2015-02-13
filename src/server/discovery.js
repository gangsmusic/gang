import debug from 'debug';
import {EventEmitter} from 'events';
import {spawn} from 'child_process';
import es from 'event-stream';
import mdns from 'mdns';

const log = debug('gang:discovery');
const EVENT_NAME = 'change';

/**
 * Discovery provides services discovery through mDNS and DNS-SD.
 *
 * let discovery = new Discovery('_gang-ipc')
 * discovery.addChangeListener(change => console.log(change))
 */
export class Discovery extends EventEmitter {

  constructor(serviceName) {
    this._browser = mdns.createBrowser(mdns.tcp(serviceName));
    this._browser.on('serviceUp', this._onChange.bind(this, true));
    this._browser.on('serviceDown', this._onChange.bind(this, false));
    this._browser.start();
  }

  stop() {
    this._browser.stop();
  }

  _onChange(isServiceUp, {name, host, port}) {
    this.emit(EVENT_NAME, {name, host, port, isServiceUp});
  }

  addChangeListener(func) {
    this.on(EVENT_NAME, func);
  }

  removeChangeListener(func) {
    this.off(EVENT_NAME, func);
  }

}

/**
 * Announce announces service through mDNS and DNS-SD.
 *
 * let announce = new Announce('_gang-ipc', 12001);
 */
export class Announce {

  constructor(serviceName, port) {
    this._serviceName = serviceName;
    this._port = port;
    this._advertiser = mdns.createAdvertisement(
      mdns.tcp(this._serviceName),
      this._port);
    this._advertiser.start();
  }

  stop() {
    this._advertiser.stop();
  }

}
