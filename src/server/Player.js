import {createReadStream} from 'fs';
import {spawn, exec}      from 'child_process';
import {EventEmitter}     from 'events';
import URL                from 'url';
import request            from 'request';
import shellescape        from 'shell-escape';


export default class Player extends EventEmitter {

  constructor() {

  }

  play(source) {
    if (source) {
      this._reset();
    }
    if (this.backend) {
      this.backend.play(source);
    }
  }

  pause() {
    if (this.backend) {
      this.backend.pause();
    }
  }

  stop() {
    this._reset();
  }

  _onProgress(progress) {
    this.emit('progress', progress);
  }

  _onDuration(duration) {
    this.emit('duration', duration);
  }

  _onPlay() {
    this.emit('play');
  }

  _onPause() {
    this.emit('pause');
  }

  _reset() {
    this.emit('stop');
    if (this.backend) {
      this.backend.removeAllListeners();
      this.backend.close();
    }
    this.backend = new Backend();
    this.backend.on('exit', this._reset.bind(this));
    this.backend.on('progress', this._onProgress.bind(this));
    this.backend.on('duration', this._onDuration.bind(this));
    this.backend.on('play', this._onPlay.bind(this));
    this.backend.on('pause', this._onPause.bind(this));
  }

}


class Backend extends EventEmitter {

  constructor() {
    this.sox = spawn('sox', this.soxOptions().split(' ') , {stdio: ['pipe', 'ignore', 'ignore']});
    this.ffmpeg = spawn('ffmpeg', this.ffmpegOptions().split(' '), {stdio: ['pipe', this.sox.stdin, 'pipe']});
    this.ffmpeg.stdin.on('error', function() {});
    this.ffmpeg.stderr.on('data', this._ffmpegLog.bind(this));

    this.ffmpeg.once('exit', this._ffmpegExit.bind(this));
    this.sox.once('exit', this._soxExit.bind(this));

    this.ffmegRunning = true;
    this.soxRunning = true;
    this.running = true;
    this.playing = false;
  }

  soxOptions() {
    return '-traw -r44100 -b16 -e signed-integer -c 2 --endian little - -tcoreaudio';
  }

  ffmpegOptions() {
    return '-i pipe:0 -f s16le pipe:1';
  }

  pause() {
    this.emit('pause');
    this.sox.kill('SIGSTOP');
  }

  resume() {
    this.emit('play');
    this.sox.kill('SIGCONT');
  }

  play(source) {
    if (!source) {
      this.resume();
      return;
    }
    if (this.playing) {
      throw new Error('already playing');
    }
    const url = URL.parse(source);
    var stream;
    switch (url.protocol) {
      case 'file:':
        const filename = decodeURIComponent(url.pathname);
        this._getFileDuration(filename)
        stream = createReadStream(filename);
        break;
      case 'http:':
      case 'https:':
        stream = request.get(source);
        break;
      default:
        throw new Error('unsupported protocol' + url.protocol);
    }
    stream.pipe(this.ffmpeg.stdin);
    this.playing = true;
    this.emit('play');
  }

  close() {
    this.sox.kill('SIGKILL');
  }

  _getFileDuration(filename) {
    const args = 'ffprobe -v quiet -print_format json -show_streams'.split(' ');
    args.push(filename);
    exec(shellescape(args), (err, stdout) => {
      if (!err) {
        const stats = JSON.parse(stdout);
        if (stats && stats.streams) {
          for (let stream of stats.streams) {
            if (stream.codec_type === 'audio') {
              this.emit('duration', Number(stream.duration));
            }
          }
        }
      }
    });
  }

  _ffmpegLog(chunk) {
    chunk = chunk.toString();
    if (!/\n/.test(chunk) && /time=([^\s]+)\s/.test(chunk)) {
      const timemark = /time=([^\s]+)\s/.exec(chunk)[1];
      this.emit('progress', this._timemarkToSeconds(timemark));
    }
    //  else if (/Duration:\s([^\s]+)\s/.test(chunk)) {
    //   if (this.duration === null) {
    //     const timemark = /Duration:\s([^\s]+)\s/.exec(chunk)[1];
    //     this.emit('duration', this._timemarkToSeconds(timemark));
    //   }
    // }
  }

  _timemarkToSeconds(timemark) {
    if (timemark.indexOf(':') === -1 && timemark.indexOf('.') >= 0) {
      return Number(timemark);
    }
    const parts = timemark.split(':');
    var secs = Number(parts.pop());
    if (parts.length) {
      secs += Number(parts.pop()) * 60;
    }
    if (parts.length) {
      secs += Number(parts.pop()) * 3600;
    }
    return secs;
  }

  _emitExit() {
    if (this.running) {
      this.running = false;
      this.emit('exit');
    }
  }

  _ffmpegExit() {
    this.ffmegRunning = false;
    if (this.soxRunning) {
      this.sox.kill('SIGKILL');
    }
    this._emitExit();
  }

  _soxExit() {
    this.soxRunning = false;
    if (this.ffmegRunning) {
      this.ffmpeg.kill('SIGKILL');
    }
    this._emitExit();
  }

}
