var React = require('react');

require('./StatusBar.styl');

var StatusBar = React.createClass({

  mixins: [require('./GangComponent')],

  onClick() {
    this.dispatch('state', {bar: 'spam'});
  },

  render() {
    return (
      <div className='StatusBar' onClick={this.onClick}>status bar</div>
    )
  }

});

module.exports = StatusBar;
