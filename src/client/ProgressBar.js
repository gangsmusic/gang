import React from 'react';
import Hoverable from './Hoverable';
import {VBox} from './Layout';
import emptyFunction from './emptyFunction';
import {rgb, rgba, border, borderStyle, boxShadow} from './StyleUtils';
import {colors} from './Theme';

const ProgressBarStyle = {
  self: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 8,
    flex: 1,
    cursor: 'pointer',
    background: 'transparent',
    overflow: 'hidden'
  },
  bar: {
    position: 'absolute',
    height: 1,
    bottom: 0,
    background: colors.accent,
    boxShadow: boxShadow(0, 0, 1, 1, colors.accent),
    transition: 'height 0.1s'
  },
  barGhost: {
    position: 'absolute',
    height: 0,
    bottom: 0,
    background: rgba(0, 0, 0, 0.05),
    borderRight: border(1, borderStyle.solid, rgba(0, 0, 0, 0.5)),
    transition: 'height 0.1s',
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
      <VBox
        {...props}
        {...this.hoverableProps}
        style={ProgressBarStyle.self}
        onClick={this.onClick}
        onMouseMove={this.onMouseMove}
        onSeek={undefined}>
        <VBox style={{
          ...ProgressBarStyle.bar,
          width,
          ...(hover && ProgressBarStyle.onHover.bar)
          }} />
        <VBox style={{
          ...ProgressBarStyle.barGhost,
          width: barGhostWidth,
          ...(hover && ProgressBarStyle.onHover.barGhost)
          }} />
      </VBox>
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
