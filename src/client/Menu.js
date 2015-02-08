import React from 'react';
import {VBox, HBox} from './Layout';
import {rgba} from './StyleUtils';
import {colors} from './Theme';
import emptyFunction from './emptyFunction';
import Hoverable from './Hoverable';
import Icon from './Icon';

let MenuItemStyle = {
  self: {
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.fadedText,
    cursor: 'pointer',
    alignItems: 'center'
  },
  icon: {
    marginRight: 10
  },
  onHover: {
    self: {
      background: rgba(0, 0, 0, 0.01)
    }
  },
  onActive: {
    self: {
      background: colors.selected,
      color: colors.selectedText
    }
  }
};

let MenuItem = React.createClass({
  mixins: [Hoverable],

  render() {
    let {icon, active, children, ...props} = this.props;
    let {hover} = this.state;
    return (
      <HBox
        {...props}
        {...this.hoverableProps}
        style={{
          ...MenuItemStyle.self,
          ...(hover && MenuItemStyle.onHover.self),
          ...(active && MenuItemStyle.onActive.self)
        }}>
        {icon &&
          <Icon
            name={icon}
            fixedWidth
            style={MenuItemStyle.icon}
            />}
        {children}
      </HBox>
    );
  }
});

let Menu = React.createClass({

  render() {
    let {items, style, active, ...props} = this.props;
    return (
      <VBox style={{...Menu.self, ...style}}>
        {items.map(item =>
          <MenuItem
            active={active === item.id}
            onClick={this.props.onActive.bind(null, item.id)}
            icon={item.icon}>
            {item.title}
          </MenuItem>)}
      </VBox>
    );
  },

  getDefaultProps() {
    return {
      onActive: emptyFunction
    };
  }
});

export default Menu;
