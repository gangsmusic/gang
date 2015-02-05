var React = require('react');
var Sidebar = require('./Sidebar');
var Browser = require('./Browser');

require('./Workspace.styl');

var Workspace = React.createClass({

  render() {
    return (
      <div className='Workspace'>
        <Browser />
      </div>
    )
  }

});

module.exports = Workspace;
