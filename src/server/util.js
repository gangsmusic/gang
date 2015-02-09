import os from 'os';
import {EventEmitter} from 'events';
import ping from 'ping';

const pingDebug = require('debug')('gang:ping-monitor');


export function getLocalAddrs() {
  const ifaces = os.networkInterfaces();
  const res = [];
  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        return;
      }
      res.push(iface.address);
    });
  });
  return res;
};


export class PingMonitor extends EventEmitter {

  constructor(addr) {
    this._addr = addr;
    this._stopped = false;
    this._running = false;
    this._cb = this._cb.bind(this);
    this._ping();
  }

  stop() {
    this._stopped = true;
  }

  _ping() {
    if (!this._running) {
      this._running = true;
      pingDebug('ping', this._addr);
      ping.sys.probe(this._addr, this._cb);
    }
  }

  _cb(alive) {
    this._running = false;
    if (!this._stopped) {
      this.emit(alive ? 'up' : 'down');
      setTimeout(() => this._ping(), 2000);
    }
  }

  start() {
    if (!this._stopped) {
      this._ping();
    }
  }

}
