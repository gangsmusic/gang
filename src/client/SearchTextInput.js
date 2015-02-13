import React from 'react';
import emptyFunction from '../emptyFunction';
import IconButton from './IconButton';
import {VBox, HBox} from './Layout';
import TextInput from './TextInput';

let SearchTextInputStyle = {
  self: {
  },
  input: {
    flex: 1
  },
  iconWrapper: {
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
  }
};


let SearchTextInput = React.createClass({

  render() {
    let {value, onChange, style, ...props} = this.props;
    return (
      <HBox style={{...SearchTextInputStyle.self, ...style}}>
        <VBox style={SearchTextInputStyle.input}>
          <TextInput {...props} value={value} onChange={onChange} />
        </VBox>
        {value &&
          <VBox style={SearchTextInputStyle.iconWrapper}>
            <IconButton icon="remove" onClick={onChange.bind(null, '')} />
          </VBox>}
      </HBox>
    );
  },

  getDefaultProps() {
    return {
      onChange: emptyFunction,
      placeholder: 'Search'
    };
  }
});

export default SearchTextInput;
