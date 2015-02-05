const React = require('react');
const numeral = require('numeral');

require('./Player.styl');

const Player = React.createClass({

  mixins: [require('./GangComponent').Mixin],

  statics: {
    observe: {
      player: ['duration', 'idle', 'current', 'playing', 'progress']
    }
  },

  play() {
    this.dispatch('play');
  },

  pause() {
    this.dispatch('pause');
  },

  seek(e) {
    const rect = e.target.getBoundingClientRect();
    const componentX = e.clientX - rect.left;
    const position = this.state.player_duration * componentX / rect.width;
    this.dispatch('seek', position);
  },

  render() {
    const idle = this.state.player_idle;
    const playing = this.state.player_playing && !idle;
    var current = null;
    if (this.state.player_current && !idle) {
      const track = this.state.player_current.toJS();
      current = <div className='Player-Current'>{`${track.artist} - ${track.name}`}</div>;
    }
    var playhead = null;
    if (this.state.player_progress !== null && this.state.player_duration !== null && !idle) {
      const currentTime = numeral(this.state.player_progress).format('00:00');
      const durationTime = numeral(this.state.player_duration).format('00:00');
      playhead = (
        <div className='Player-Playhead'>
          <progress onClick={this.seek} className='Player-Progress' value={this.state.player_progress} max={this.state.player_duration} />
          <div className='Player-Time'>{`${currentTime} / ${durationTime}`}</div>
        </div>
      );
    }
    return (
      <div className='Player'>
        <button onClick={this.play} disabled={playing}>play</button>
        <button onClick={this.pause} disabled={!playing}>pause</button>
        {current}
        {playhead}
      </div>
    );
  }

});

module.exports = Player;
