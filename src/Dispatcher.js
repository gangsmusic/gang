import Immutable from 'immutable';
import debug from 'debug';
import {Dispatcher as BaseDispatcher} from 'flux';
import invariant from './invariant';

let log = debug('gang:Dispatcher');

class Dispatcher extends BaseDispatcher {

  constructor() {
    super();
    this.stores = Immutable.OrderedMap();
  }

  dispatch(action) {
    log('action', action);
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

let dispatcher = new Dispatcher();

export default dispatcher;

module.hot && module.hot.decline();
