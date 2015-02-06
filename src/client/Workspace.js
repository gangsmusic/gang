var React = require('react');
var Browser = require('./Browser');
import {Box} from './Box';

const WorkspaceStyle = {
  flex: 1
};

var Workspace = React.createClass({

  render() {
    return (
      <Box style={WorkspaceStyle}>
        <Browser />
      </Box>
    )
  }

});

module.exports = Workspace;
