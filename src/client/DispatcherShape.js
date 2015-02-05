const React = require('react');
const Immutable = require('immutable');

module.exports = React.PropTypes.shape({
  dispatch: React.PropTypes.func.isRequired,
  execute: React.PropTypes.func.isRequired,
  state: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  library: React.PropTypes.instanceOf(Immutable.List).isRequired
});
