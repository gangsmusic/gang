import React from 'react';
import Hoverable from './Hoverable';
import {VBox} from './Layout';
import emptyFunction from './emptyFunction';
import {rgb, rgba, border, boxShadow} from './StyleUtils';
import {colors} from './Theme';

const ProgressBarStyle = {
  self: {
    width: '100%',
    height: 8,
    flex: 1,
    cursor: 'pointer',
    background: 'transparent',
    overflow: 'hidden',
    WebkitAppRegion: 'no-drag'
  },
  bar: {
    position: 'absolute',
    height: 1,
    bottom: 0,
    background: colors.accent,
    boxShadow: boxShadow(0, 0, 1, 0, colors.accent),
    transition: 'height 0.1s'
  },
  barGhost: {
    position: 'absolute',
    height: 0,
    bottom: 0,
    background: rgba(0, 0, 0, 0.05),
    borderRight: border(1, border.style.solid, rgba(0, 0, 0, 0.1)),
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
    var {value, max, style, ...props} = this.props;
    var {hover, barGhostWidth} = this.state;
    var width = `${value / max * 100}%`;
    return (
      <VBox
        {...props}
        {...this.hoverableProps}
        style={{...ProgressBarStyle.self, ...style}}
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
