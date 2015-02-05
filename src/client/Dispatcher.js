const {EventEmitter} = require('events');
const Immutable = require('immutable');

class Dispatcher extends EventEmitter {

  constructor(data) {
    this.setMaxListeners(0);
    this._data = data;
  }

  get data() {
    return this._data;
  }

  set data(val) {
    const oldData = this._data;
    this._data = val;
    this._data.forEach((prop, key) => {
      if (!Immutable.is(oldData.get(key), val.get('key'))) {
        this.emit(key, prop);
      }
    });
  }

  read(keys) {
    const result = {};
    for (let key of keys) {
      result[key] = this._data.get(key);
    }
    return result;
  }

}

module.exports = Dispatcher;
