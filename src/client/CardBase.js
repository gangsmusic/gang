import React from 'react';
import {VBox} from './Layout';

const CardBaseStyle = {
  self: {
    overflowX: 'hidden',
    overflowY: 'auto',
    minWidth: 360,
    marginRight: 10,
  }
};

let CardBase = React.createClass({

  render() {
    let {style, children, ...props} = this.props;
    return (
      <VBox {...props} style={{...CardBaseStyle.self, ...style}}>
        {children}
      </VBox>
    );
  }
});

export default CardBase;
