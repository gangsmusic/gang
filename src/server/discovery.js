import debug from 'debug';
import {EventEmitter} from 'events';
import {spawn} from 'child_process';
import es from 'event-stream';

const log = debug('gang:discovery');
const EVENT_NAME = 'change';

/**
 * const d = new Discovery;
 * d.on('data', x => console.log(x));
 */
export class Discovery extends EventEmitter {

  constructor() {
    this.start();
  }

  start() {
    this.stop();
    this._dns = spawn('dns-sd', ['-Z', '_gang-ipc'])
    this._dns.stdout
      .pipe(es.map((data, cb) => cb(null, data.toString())))
      .pipe(es.split())
      .pipe(es.map(function(line, cb) {
        const match = /(\w+)\._gang-ipc\._tcp\s+SRV\s+\d+\s+\d+\s+(\d+)\s+([^\s]+)/.exec(line);
        if (match) {
          let [_, name, port, host] = match;
          port = parseInt(port, 10);
          debug('change event', name, host, port);
          this.emit(EVENT_NAME, {name, port, host});
        }
        cb();
      }.bind(this)));
  }

  stop() {
    if (this._dns) {
      this._dns.kill('SIGKILL');
      this._dns = null;
    }
  }

  addChangeListener(func) {
    this.on(EVENT_NAME, func);
  }

  removeChangeListener(func) {
    this.off(EVENT_NAME, func);
  }

}


/**
 * const a = new Announce('library-name', 12001);
 */
export class Announce {

  constructor(name, port) {
    this._name = name;
    this._port = port.toString();
    this.start();
  }

  start() {
    this.stop();
    this._dns = spawn('dns-sd', ['-R', this._name, '_gang-ipc', '.', this._port])
  }

  stop() {
    if (this._dns) {
      this._dns.kill('SIGKILL');
      this._dns = null;
    }
  }

}
