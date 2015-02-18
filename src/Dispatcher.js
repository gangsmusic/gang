import Immutable from 'immutable';
import string from 'string';
import debug from 'debug';
import {Dispatcher as BaseDispatcher} from 'flux';
import invariant from './invariant';

let log = debug('gang:Dispatcher');

class Dispatcher extends BaseDispatcher {

  constructor(origin) {
    super();
    this.origin = origin;
    this.stores = Immutable.OrderedMap();
  }

  dispatch(action) {
    if (!action.origin) {
      action = {...action, origin: this.origin};
    }
    log(action.type);
    super.dispatch(action);
  }

  registerStore(store) {
    let index = this.register(store._handleAction.bind(store));
    invariant(
      !this.stores.has(store.name),
      `duplicate store with name: ${store.name}`
    );
    this.stores = this.stores.set(store.name, store);
    return index;
  }
}

let dispatcher = new Dispatcher(typeof window === 'undefined' ? 'server' : 'client');

export default dispatcher;

module.hot && module.hot.decline();
