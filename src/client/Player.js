var React = require('react');

require('./Player.styl');

var Player = React.createClass({

  mixins: [require('./GangComponent')],

  play() {
    this.execute('play');
  },

  pause() {
    this.execute('pause');
  },

  render() {
    return (
      <div className='Player'>
        <button onClick={this.play} disabled={this.get('playing')}>play</button>
        <button onClick={this.pause} disabled={!this.get('playing')}>pause</button>
      </div>
    );
  }

});

module.exports = Player;
