function StateFromStore(...stores) {
  return {

    getInitialState() {
      let state = {};
      stores.forEach(store => {
        state = {...state, [store.name]: store.getState()};
      });
      return state;
    },

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this._handleStoreChange));
    },

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this._handleStoreChange));
    },

    _handleStoreChange(store) {
      this.setState({[store.name]: store.getState()});
    }

  };
};

export default StateFromStore;
