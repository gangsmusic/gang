var React = require('react');

module.exports = React.PropTypes.shape({
  dispatch: React.PropTypes.func.isRequired,
  execute: React.PropTypes.func.isRequired,
  state: React.PropTypes.object.isRequired
});
