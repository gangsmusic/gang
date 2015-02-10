import debug from 'debug';

const log = debug('gang:Service');

class Service {

  constructor(config) {
    this.config = config;
    this.started = false;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  start() {
    if (!this.started) {
      log('starting service', this.constructor.name);
      this.didStart();
      this.started = true;
    }
  }

  stop() {
    if (this.started) {
      log('stopping service', this.constructor.name);
      this.willStop();
      this.started = false;
    }
  }
}

export default Service;
