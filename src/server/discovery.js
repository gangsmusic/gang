import {EventEmitter} from 'events';
import {spawn} from 'child_process';
import es from 'event-stream';


/**
 * const d = new Discovery;
 * d.on('data', x => console.log(x));
 */
export default class Discovery extends EventEmitter {

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
          this.emit('data', {
            name: match[1],
            port: parseInt(match[2], 10),
            domain: match[3]
          });
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

}
