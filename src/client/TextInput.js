import React from 'react';
import {border, boxShadow, rgba} from './StyleUtils';
import Focusable from './Focusable';

let TextInputStyle = {
  self: {
    background: 'none',
    outline: 'none',
    padding: 7,
    color: rgba(0, 0, 0, 0.5),
    fontSize: 14,
    border: border.style.none,
    borderBottom: border(1, border.style.solid, rgba(0, 0, 0, 0.1))
  },
  onFocus: {
    self: {
      borderBottom: border(1, border.style.solid, rgba(0, 0, 0, 0.2)),
      background: rgba(0, 0, 0, 0.01)
    }
  }
};

let TextInput = React.createClass({

  render() {
    let {focus, ...props} = this.props;
    return (
      <input
        {...props}
        type="text"
        style={{
          ...TextInputStyle.self,
          ...(focus && TextInputStyle.onFocus.self)
        }}
        />
    );
  }
});

TextInput = Focusable(TextInput);

export default TextInput;
