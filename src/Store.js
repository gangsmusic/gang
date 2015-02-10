import debug from 'debug';
import {EventEmitter} from 'events';
import Dispatcher from './Dispatcher';
import ActionTypes from './ActionTypes';

const CHANGE_EVENT = 'change';

const log = debug('gang:Store');

class Store extends EventEmitter {

  constructor() {
    this.dispatcher = Dispatcher;
    this.handled = this.dispatcher.register(this._handleAction.bind(this));
    this.state = null;
  }

  get name() {
    return this.constructor.name;
  }

  getState() {
    throw new Error('not implemented');
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
}

export default Store;
