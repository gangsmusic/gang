import React from 'react';
import {HBox} from './Layout';

const WindowButtonsStyle = {
  self: {
    width: 52,
    zIndex: 100,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  base: {
    width: 12,
    height: 12,
    borderRadius: 6,
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  close: {
    border: '1px solid #f1544c',
    background: '#ff5e4f'
  },
  minimize: {
    border: '1px solid #e9b30d',
    background: '#ffbe0b'
  },
  maximize: {
    border: '1px solid #2ebb55',
    background: '#0dd02a'
  }
};

const WindowButtons = React.createClass({

  render() {
    return (
      <HBox style={WindowButtonsStyle.self}>
        <div style={{...WindowButtonsStyle.base, ...WindowButtonsStyle.close}} />
        <div style={{...WindowButtonsStyle.base, ...WindowButtonsStyle.minimize}} />
        <div style={{...WindowButtonsStyle.base, ...WindowButtonsStyle.maximize}} />
      </HBox>
    );
  }

});

module.exports = WindowButtons;
