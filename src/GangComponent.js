module.exports = {
  contextTypes: {
    dispatcher: require('./DispatcherShape').isRequired,
  },

  dispatch: function(ev, data) {
    this.context.dispatcher.dispatch(ev, data);
  },

  get: function(keyPath) {
    var state = this.context.dispatcher.state;
    if (typeof keyPath === 'string') {
      return state.get(keyPath);
    } else {
      return state.getIn(keyPath);
    }
  }
};
