import React from 'react';
import debug from 'debug'
import Pure from './Pure';

const debugComponent = debug('gang:component');

exports.Mixin = {

  mixins: [Pure],

  contextTypes: {
    dispatch: React.PropTypes.func.isRequired
  },

  dispatch(ev, data) {
    this.context.dispatch(ev, data);
  },

  componentDidUpdate() {
    debugComponent('redraw', this.constructor.displayName);
  }

};
