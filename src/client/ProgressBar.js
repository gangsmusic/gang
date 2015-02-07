import React from 'react';
import Hoverable from './Hoverable';
import {Box} from './Box';
import emptyFunction from './emptyFunction';
import {rgb, boxShadow} from './StyleUtils';

const ProgressBarStyle = {
  self: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 8,
    flex: 1,
    cursor: 'pointer',
    background: 'transparent'
  },
  bar: {
    position: 'absolute',
    height: 1,
    bottom: 0,
    background: rgb(255, 108, 108),
    transition: 'height 0.1s'
  },
  barGhost: {
    position: 'absolute',
    height: 0,
    bottom: 0,
    background: 'black',
    transition: 'height 0.1s',
    opacity: '0.1'
  },
  onHover: {
    bar: {
      height: 8
    },
    barGhost: {
      height: 8
    }
  }
};

let ProgressBar = React.createClass({
  mixins: [Hoverable],

  render() {
    var {value, max, ...props} = this.props;
    var {hover, barGhostWidth} = this.state;
    var width = `${value / max * 100}%`;
    return (
      <Box
        {...props}
        {...this.hoverableProps}
        style={ProgressBarStyle.self}
        onClick={this.onClick}
        onMouseMove={this.onMouseMove}
        onSeek={undefined}>
        <Box style={{
          ...ProgressBarStyle.bar,
          width,
          ...(hover && ProgressBarStyle.onHover.bar)
          }} />
        <Box style={{
          ...ProgressBarStyle.barGhost,
          width: barGhostWidth,
          ...(hover && ProgressBarStyle.onHover.barGhost)
          }} />
      </Box>
    );
  },

  getDefaultProps() {
    return {
      onClick: emptyFunction,
      onSeek: emptyFunction
    };
  },

  getInitialState() {
    return {
      barGhostWidth: 0
    };
  },

  onClick(e) {
    var {onClick, onSeek, max} = this.props;
    onClick(e);
    var {left, width} = this.getDOMNode().getBoundingClientRect();
    var seek = (e.clientX - left) / width * max;
    onSeek(seek);
  },

  onMouseMove(e) {
    var {left} = this.getDOMNode().getBoundingClientRect();
    this.setState({barGhostWidth: e.clientX - left});
  }
});

export default ProgressBar;
