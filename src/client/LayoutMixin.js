let LayoutMixin = {

  getInitialState() {
    return {
      width: 0,
      height: 0
    };
  },

  _updateLayout() {
    if (this.isMounted()) {
      const {width, height} = this.getDOMNode().getBoundingClientRect();
      this.setState({width, height});
    }
  },

  componentDidMount() {
    window.addEventListener('resize', this._updateLayout);
    this._updateLayout();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._updateLayout);
  }

};

export default LayoutMixin;
