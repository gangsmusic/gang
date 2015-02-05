const fs = require('fs');
const path = require('path');
const {tmpdir} = require('os');
const {inspect} = require('util');
const {spawn} = require('child_process');
const {Socket} = require('net');
const {EventEmitter} = require('events');
const es = require('event-stream');
const debug = require('debug')('gang:mpv');
const debugMpv = require('debug')('gang:mpv-out');
const debugIpc = require('debug')('gang:mpv-ipc');

var vendorPath;
if (process.versions['atom-shell'] && process.env.NODE_ENV === 'production') {
  vendorPath = path.join(process.resourcesPath, 'vendor');
} else {
  vendorPath = path.join(path.dirname(__filename), '..', '..', 'vendor');
}


export default class MPV extends EventEmitter {

  constructor() {
    const socketPath = path.join(tmpdir(), 'gang.mpv.sock');

    this._connected = false;
    this._commandQueue = [];

    const watcher = fs.watch(path.dirname(socketPath), {persistent: false}, () => {
      if (!this._connected) {
        watcher.close();
        this._connect(socketPath);
      }
    });

    const mpvBin = path.join(vendorPath, 'mpv');
    debug(`socket path ${socketPath}`);
    debug(`spawning ${mpvBin}`);

    this._mpv = spawn(mpvBin, ['-no-video', '--quiet', '--idle', '--input-unix-socket=' + socketPath], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const kill = () => this._mpv.kill('SIGKILL');
    process.on('exit', kill);
    this._mpv.on('exit', () => process.removeListener('exit', kill));

    this._mpv.stdout
      .pipe(es.split())
      .pipe(es.map(line => debugMpv('out', line)));

    this._mpv.stderr
      .pipe(es.split())
      .pipe(es.map(line => debugMpv('err', line)));

    this._progress = 0;
  }

  play(path) {
    if (path) {
      debug('play', path);
      this._execute('loadfile', path);
    }
    this.resume();
  }

  pause() {
    debug('pause');
    this._setProperty('pause', true);
  }

  resume() {
    debug('resume');
    this._setProperty('pause', false);
  }

  seek(pos) {
    debug('seek', pos);
    this._setProperty('time-pos', pos);
  }

  _setProperty(name, val) {
    this._execute('set_property', name, val);
  }

  _execute(command, ...args) {
    const payload = JSON.stringify({
      command: [command].concat(args)
    });
    debugIpc('execute', payload);
    if (this._connected) {
      this._send(payload);
    } else {
      this._commandQueue.push(payload);
    }
  }

  _send(data) {
    debugIpc('send', data);
    this._ipc.write(data + '\n');
  }

  _onEvent(data, cb) {
    debugIpc('incoming', data);
    if (data.event === 'property-change') {
      switch (data.name) {
        case 'pause':
          this.emit('playing', !data.data);
          break;
        case 'volume':
          this.emit('volume', data.data);
          break;
        case 'seeking':
          this.emit('seek', data.data);
          break;
        case 'time-pos':
          this._progress = data.data;
          this.emit('progress', data.data);
          break;
        case 'playtime-remaining':
          if (this._progress === 0) {
            this.emit('duration', data.data);
          }
          break;
        case 'idle':
          this.emit('idle', data.data);
          break;
        case 'paused-for-cache':
          this.emit('caching', data.data);
          break;
        case 'path':
          this.emit('path', data.data);
          break;
        default:
          debugIpc('property', data.name, JSON.stringify(data.data));
      }
    } else {
      switch(data.event) {
        case 'playback-restart':
          this.emit('playing', true);
          break;
        case 'pause':
          this.emit('playing', false);
          break;
        case 'unpause':
          this.emit('playing', true);
          break;
        default:
          debugIpc('event', data);
      }
    }
    cb();
  }

  _connect(socketPath) {
    debug(`connecting to ${socketPath}`);
    this._ipc = new Socket();
    this._ipc.connect(socketPath);
    this._ipc
      .pipe(es.split())
      .pipe(es.parse())
      .pipe(es.map((data, cb) => this._onEvent(data, cb)));
    this._connected = true;
    [
      'volume', 'pause', 'path', 'time-pos', 'idle', 'paused-for-cache',
      'seeking', 'playlist', 'seekable', 'playtime-remaining'
    ].forEach((prop, idx) => this._execute('observe_property', idx, prop));
    this._commandQueue.forEach(payload => this._send(payload));
    this._commandQueue = [];
    this.play(path.join(vendorPath, 'silence.mp3'));
  }

}
