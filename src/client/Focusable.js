import React from 'react';
import emptyFunction from '../emptyFunction';

export default function Focusable(Component) {

  return React.createClass({

    displayName: `${Component.displayName}Focusable`,

    render() {
      return (
        <Component
          {...this.props}
          focus={this.state.focus}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          />
      );
    },

    getDefaultProps() {
      return {
        onFocus: emptyFunction,
        onBlur: emptyFunction
      };
    },

    getInitialState() {
      return {focus: false};
    },

    onFocus(e) {
      this.setState({focus: true});
      this.props.onFocus(e);
    },

    onBlur(e) {
      this.setState({focus: false});
      this.props.onBlur(e);
    }
  });
}
