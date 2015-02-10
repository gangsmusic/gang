import debug from 'debug';
import {Dispatcher as BaseDispatcher} from 'flux';

let log = debug('gang:Dispatcher');

class Dispatcher extends BaseDispatcher {

  dispatch(action) {
    log('action', action);
    super.dispatch(action);
  }
}

let dispatcher = new Dispatcher();

export default dispatcher;
