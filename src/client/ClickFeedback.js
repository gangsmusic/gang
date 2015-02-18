import React from 'react';
import {VBox} from './Layout';
import {rgba, scale3d, createAnimation} from './StyleUtils';

export let borisFeedbackStyle = createAnimation([
  {
    offset:0, 
    opacity: 0,
    transform: scale3d(0, 0, 1)
  },
  {
    offset: 0.25,
    opacity: 1,
    transform: scale3d(0.2, 0.2, 1)
  },
  {
    offset: 0.5,
    opacity: 1,
    transform: scale3d(0.3, 0.3, 1)
  },
  {
    offset: 1,
    opacity: 0,
    transform: scale3d(1.2, 1.2, 1)
  }
], {
  duration: 200,
  direction: 'forwards'
});


let ClickFeedbackStyle = {
  ghost: {
    background: rgba(0, 0, 0, 0.05),
    position: 'absolute',
    top: '50%',
    left: '50%',
    margin: '-25px 0 0 -25px',
    width: 50,
    height: 50,
    borderRadius: '50%',
    content: '',
    opacity: 0,
    pointerEvents: 'none'
  }
};

let ClickFeedback = React.createClass({

  render() {
    let {children, ...props} = this.props;
    return (
      <VBox {...props} onClick={this.onClick} feedbackStyle={undefined}>
        {children}
        <div
          style={ClickFeedbackStyle.ghost}
          ref="ghost"
          />
      </VBox>
    );
  },

  getDefaultProps() {
    return {
      feedbackStyle: borisFeedbackStyle
    };
  },

  componentWillMount() {
    this.__player = null;
  },

  componentWillUnmount() {
    this.__player = null;
  },

  onClick(e) {
    if (this.__player) {
      this.__player.finish();
      this.__player = null;
    }
    let {feedbackStyle, onClick} = this.props;
    e.persist();
    this.__player = feedbackStyle.apply(this.refs.ghost.getDOMNode());
    this.__player.addEventListener('finish', () => {
      this.__player = null;
      onClick(e)
    });
  }
});

export default ClickFeedback;
