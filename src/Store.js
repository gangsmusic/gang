import debug from 'debug';
import {EventEmitter} from 'events';
import invariant from './invariant';
import Dispatcher from './Dispatcher';
import ActionTypes from './ActionTypes';

const CHANGE_EVENT = 'change';

const log = debug('gang:Store');

let _ALLOW_STORE_CREATE = false;

class Store extends EventEmitter {

  constructor() {
    invariant(
      _ALLOW_STORE_CREATE,
      'Store instance could only be created via Store.getInstance() static method'
    );
    this.debug = debug(`gang:${this.constructor.name}`);
    this.dispatcher = Dispatcher;
    this.handled = this.dispatcher.registerStore(this);
    this.state = null;
  }

  get name() {
    return this.constructor.name;
  }

  getState() {
    return this.state;
  }

  get isServerOnly() {
    return false;
  }

  _handleAction(action) {
    if (action.type === ActionTypes.BOOTSTRAP_STORES) {
      action.payload.forEach(({name, state}) => {
        if (name === this.name) {
          this.hydrate(state);
          this.emitChange();
        }
      });
    } else {
      this.handleAction(action);
    }
  }

  handleAction(action) {
    throw new Error('not implemented');
  }

  transformState(func) {
    this.state = func(this.state);
    this.emitChange();
  }

  dehydrate() {
    return this.state;
  }

  hydrate(state) {
    this.state = state;
  }

  emitChange() {
    this.emit(CHANGE_EVENT, this);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  static getInstance() {
    _ALLOW_STORE_CREATE = true;
    try {
      global.__STORE_INSTANCES = global.__STORE_INSTANCES || {};
      if (global.__STORE_INSTANCES[this.name] === undefined) {
        global.__STORE_INSTANCES[this.name] = new this();
      }
      return global.__STORE_INSTANCES[this.name];
    } finally {
      _ALLOW_STORE_CREATE = false;
    }
  }
}

export default Store;

module.hot && module.hot.decline();
