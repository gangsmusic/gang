/**
 * Layout primitives based on flexbox.
 *
 * @todo There's too much code duplication, we can get rid of it when we port
 *       the codebase to React 0.13 with ES6 classes.
 */

import React from 'react';
import {border, borderStyle} from './StyleUtils';

export const BoxStyle = {
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

export const VBoxStyle = {
  ...BoxStyle,
  flexDirection: 'column'
};

export const HBoxStyle = {
  ...BoxStyle,
  flexDirection: 'row'
}

export let VBox = React.createClass({

  render() {
    var {style, children, ...props} = this.props;
    return (
      <div {...props} style={{...VBoxStyle, ...style}}>
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
