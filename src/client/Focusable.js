let Focusable = {

  getInitialState() {
    return {focus: false};
  },

  componentWillMount() {
    this.focusableProps = {
      tabIndex: 1,
      onFocus: this.focusableOnFocus,
      onBlur: this.focusableOnBlur
    }
  },

  componentWillUnmount() {
    this.focusableProps = undefined;
  },

  focusableOnFocus() {
    this.setState({focus: true});
  },

  focusableOnBlur() {
    this.setState({focus: false});
  }
};

export default Focusable;

