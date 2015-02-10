import React from 'react';
import {colors} from './Theme';

const DropZoneStyle = {
  position: 'absolute',
  width: '100vw',
  height: '100vh',
  boxShadow: `inset 0px 0px 5px 3px ${colors.selected}`,
  zIndex: '1500'
};

const DropZone = React.createClass({
  render() {
    return <div style={DropZoneStyle} />;
  }
});

module.exports = DropZone;
