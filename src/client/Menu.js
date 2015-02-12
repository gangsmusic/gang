import React from 'react';
import {VBox, HBox} from './Layout';
import {rgba, border} from './StyleUtils';
import {colors, NonSelectableMixin} from './Theme';
import emptyFunction from '../emptyFunction';
import Hoverable from './Hoverable';
import Icon from './Icon';

let MenuItemStyle = {
  self: {
    ...NonSelectableMixin,
    userSelect: 'none',
    WebkitUserSelect: 'none',
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

  render() {
    let {icon, active, hover, children, ...props} = this.props;
    return (
      <HBox
        {...props}
        style={{
          ...MenuItemStyle.self,
          ...(hover && MenuItemStyle.onHover.self),
          ...(active && MenuItemStyle.onActive.self)
        }}>
        {icon &&
          <VBox style={MenuItemStyle.icon}>
            <Icon name={icon} fixedWidth />
          </VBox>}
        {children}
      </HBox>
    );
  }
});

MenuItem = Hoverable(MenuItem);

export {MenuItem};

export let Menu = React.createClass({

  render() {
    let {items, style, active, ...props} = this.props;
    return (
      <VBox style={style}>
        {items.map(item =>
          <MenuItem
            key={item.id}
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

const MenuSeparatorStyle = {
  self: {
    ...NonSelectableMixin,
    paddingTop: 15,
    paddingRight: 5,
    paddingBottom: 2,
    paddingLeft: 5,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.fadedText,
    textTransform: 'uppercase',
    borderBottom: border(1, border.style.solid, rgba(0, 0, 0, 0.1))
  }
};

export let MenuSeparator = React.createClass({

  render() {
    let {children, ...props} = this.props;
    return (
      <VBox {...props} style={MenuSeparatorStyle.self}>
        {children}
      </VBox>
    );
  }
});

export default Menu;
