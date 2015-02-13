import React from 'react';
import {rgba} from './StyleUtils';
import {VBox} from './Layout';
import Icon from './Icon';
import Hoverable from './Hoverable';

let IconButtonStyle = {
  self: {
    cursor: 'pointer',
    padding: '0 10px',
    color: rgba(0, 0, 0, 0.2)
  },
  onHover: {
    self: {
      color: rgba(0, 0, 0, 0.8)
    }
  }
}

let IconButton = React.createClass({

  render() {
    let {icon, hover, ...props} = this.props;
    let style = {
      ...IconButtonStyle.self,
      ...(hover && IconButtonStyle.onHover.self)
    };
    return (
      <VBox {...props} style={style}>
        <Icon name={icon} />
      </VBox>
    );
  }
});

IconButton = Hoverable(IconButton);

export default IconButton;
