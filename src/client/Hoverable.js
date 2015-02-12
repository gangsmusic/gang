import React from 'react';
import emptyFunction from '../emptyFunction';

export default function Hoverable(Component) {

  return React.createClass({
    displayName: `${Component.displayName}Hoverable`,

    render() {
      return (
        <Component
          {...this.props}
          hover={this.state.hover}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          />
      );
    },

    getDefaultProps() {
      return {
        onMouseEnter: emptyFunction,
        onMouseLeave: emptyFunction
      };
    },

    getInitialState() {
      return {hover: false};
    },

    onMouseEnter(e) {
      this.setState({hover: true});
      this.props.onMouseEnter(e);
    },

    onMouseLeave(e) {
      this.setState({hover: false});
      this.props.onMouseLeave(e);
    }
  });
}
