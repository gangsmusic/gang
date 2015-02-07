/**
 * Layout primitives based on flexbox.
 *
 * @todo There's too much code duplication, we can get rid of it when we port
 *       the codebase to React 0.13 with ES6 classes.
 */

import React from 'react';
import {border, borderStyle} from './StyleUtils';

const BaseStyle = {
  boxSizing: 'border-box',
  position: 'relative',
  border: border(0, borderStyle.solid, 'black'),
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flexShrink: 0
};

const BoxStyle = {
  ...BaseStyle,
  flexDirection: 'column'
};

const HBoxStyle = {
  ...BaseStyle,
  flexDirection: 'row'
}

export let Box = React.createClass({

  render() {
    var {style, children, ...props} = this.props;
    return (
      <div {...props} style={{...BoxStyle, ...style}}>
        {children}
      </div>
    );
  }
});

export let HBox = React.createClass({

  render() {
    var {style, children, ...props} = this.props;
    return (
      <div {...props} style={{...HBoxStyle, ...style}}>
        {children}
      </div>
    );
  }
});

export default Box;
