import React from 'react';
import debug from 'debug'
import Dispatcher from './Dispatcher';
import Pure from './Pure';

const debugComponent = debug('gang:component');

const DISPATCHERS = exports.DISPATCHERS = {
  player: new Dispatcher(require('../shared/emptyState'))
};

exports.Mixin = {

  mixins: [Pure],

  contextTypes: {
    dispatch: React.PropTypes.func.isRequired,
    execute: React.PropTypes.func.isRequired
  },

  dispatch(ev, data) {
    this.context.dispatch(ev, data);
  },

  execute(name) {
    this.context.execute(name);
  },

  componentDidMount() {
    this._stateObservers = {};
    for (let dispatcherName in this.constructor.observe) {
      const dispatcher = DISPATCHERS[dispatcherName];
      for (let dispatcherProp of this.constructor.observe[dispatcherName]) {
        let key = `${dispatcherName}_${dispatcherProp}`;
        this._stateObservers[key] = (val) => {
          if (this.isMounted()) {
            const partialState = {};
            partialState[key] = val;
            this.setState(partialState);
          }
        };
        dispatcher.on(dispatcherProp, this._stateObservers[key]);
      }
    }
  },

  componentWillUnmount() {
    for (let dispatcherName in this.constructor.observe) {
      let dispatcher = DISPATCHERS[dispatcherName];
      for (let dispatcherProp of this.constructor.observe[dispatcherName]) {
        const key = `${dispatcherName}_${dispatcherProp}`;
        dispatcher.removeListener(dispatcherProp, this._stateObservers[key]);
      }
    }
  },

  getInitialState() {
    const state = {};
    for (var dispatcherName in this.constructor.observe) {
      const dispatcher = DISPATCHERS[dispatcherName];
      const dispatcherState = dispatcher.read(this.constructor.observe[dispatcherName]);
      for (var dispatcherProp in dispatcherState) {
        state[`${dispatcherName}_${dispatcherProp}`] = dispatcherState[dispatcherProp];
      }
    }
    return state;
  },

  componentDidUpdate() {
    debugComponent('redraw', this.constructor.displayName);
  }

};
