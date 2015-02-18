import React from 'react';
import CardBase from './CardBase';
import {rgba, boxShadow} from './StyleUtils';

let CardStyle = {
  self: {
    boxShadow: boxShadow(0, 0, 2, 3, rgba(0, 0, 0, 0.01)),
    background: rgba(255, 255, 255, 1)
  }
};

let Card = React.createClass({

  render() {
    let {style, children, ...props} = this.props;
    return (
      <CardBase {...props} style={{...CardStyle.self, ...style}}>
        {children}
      </CardBase>
    );
  }
});

export default Card;
