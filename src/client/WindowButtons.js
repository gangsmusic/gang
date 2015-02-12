import React from 'react';
import {HBox} from './Layout';
import {uiWindowClose, uiWindowMaximize, uiWindowMinimize} from '../Actions';
import Hoverable from './Hoverable';

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
    cursor: 'pointer',
    WebkitAppRegion: 'no-drag'
  },
  hover: {
    opacity: 0.7
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

let WindowButton = React.createClass({

  propTypes: {
    type: React.PropTypes.oneOf(['close', 'minimize', 'maximize'])
  },

  render() {
    const {type, hover, ...props} = this.props;
    const style = {
      ...WindowButtonsStyle.base,
      ...WindowButtonsStyle[this.props.type],
      ...(hover && WindowButtonsStyle.hover)
    };
    return <div {...props} style={style} />;
  }

});

WindowButton = Hoverable(WindowButton);

const WindowButtons = React.createClass({

  render() {
    return (
      <HBox style={WindowButtonsStyle.self}>
        <WindowButton type='close' onClick={uiWindowClose} />
        <WindowButton type='minimize' onClick={uiWindowMinimize} />
        <WindowButton type='maximize' onClick={uiWindowMaximize} />
      </HBox>
    );
  }

});

module.exports = WindowButtons;
