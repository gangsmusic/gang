var React = require('react');
var Browser = require('./Browser');
import {VBox} from './Layout';

const WorkspaceStyle = {
  flex: 1
};

var Workspace = React.createClass({

  render() {
    return (
      <VBox style={WorkspaceStyle}>
        <Browser />
      </VBox>
    )
  }

});

module.exports = Workspace;
