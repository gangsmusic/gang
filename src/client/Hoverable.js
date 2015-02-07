let Hoverable = {

  getInitialState() {
    return {hover: false};
  },

  componentWillMount() {
    this.hoverableProps = {
      onMouseEnter: this.hoverableOnMouseEnter,
      onMouseLeave: this.hoverableOnMouseLeave
    }
  },

  componentWillUnmount() {
    this.hoverableProps = undefined;
  },

  hoverableOnMouseEnter() {
    this.setState({hover: true});
  },

  hoverableOnMouseLeave() {
    this.setState({hover: false});
  }
};

export default Hoverable;
