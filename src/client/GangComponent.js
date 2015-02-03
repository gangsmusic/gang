module.exports = {

  contextTypes: {
    dispatcher: require('./DispatcherShape').isRequired,
  },

  dispatch(ev, data) {
    this.context.dispatcher.dispatch(ev, data);
  },

  get(keyPath) {
    var state = this.context.dispatcher.state;
    if (typeof keyPath === 'string') {
      return state.get(keyPath);
    } else {
      return state.getIn(keyPath);
    }
  }
};
