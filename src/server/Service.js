import debug from 'debug';

class Service {

  constructor(config) {
    this.debug = debug(`gang:services:${this.constructor.name}`);
    this.config = config;
    this.started = false;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  start() {
    if (!this.started) {
      this.debug('starting');
      this.didStart();
      this.started = true;
    }
  }

  stop() {
    if (this.started) {
      this.debug('stopping');
      this.willStop();
      this.started = false;
    }
  }
}

export default Service;
