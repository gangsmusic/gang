import React from 'react/lib/ReactWithAddons';
import emptyFunction from '../emptyFunction';
import {rgba, boxShadow} from './StyleUtils';
import {VBox, HBox} from './Layout';
import IconButton from './IconButton';
import SearchTextInput from './SearchTextInput';

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
    let {searchValue} = this.state;
    return (
      <HBox {...props} style={{...HomeStyle.self, ...style}}>
        <Card>
        </Card>
        <CardBase>
          <SearchTextInput
            value={searchValue}
            onChange={this.onSearchChange}
            />
        </CardBase>
      </HBox>
    );
  },

  getInitialState() {
    return {
      searchValue: ''
    };
  },

  onSearchChange(searchValue) {
    this.setState({searchValue});
  }
});

export default Home;
