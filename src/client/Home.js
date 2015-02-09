import React from 'react/lib/ReactWithAddons';
import {rgba, boxShadow} from './StyleUtils';
import {VBox, HBox} from './Layout';
import TextInput from './TextInput';
import Icon from './Icon';

const CardBaseStyle = {
  self: {
    minWidth: 360,
    marginRight: 10
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

const HomeStyle = {
  self: {
    padding: 10,
    flex: 1,
    background: rgba(0, 0, 0, 0.01),
    overflowX: 'auto'
  }
};

let Home = React.createClass({

  render() {
    let {style, ...props} = this.props;
    return (
      <HBox {...props} style={{...HomeStyle.self, ...style}}>
        <Card>
        </Card>
        <CardBase>
          <TextInput placeholder="Search" />
        </CardBase>
      </HBox>
    );
  }
});

export default Home;
