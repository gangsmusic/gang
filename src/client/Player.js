const React = require('react');
const numeral = require('numeral');

require('./Player.styl');

const Player = React.createClass({

  mixins: [require('./GangComponent')],

  play() {
    this.dispatch('play');
  },

  pause() {
    this.dispatch('pause');
  },

  seek(e) {
    const rect = e.target.getBoundingClientRect();
    const componentX = e.clientX - rect.left;
    const position = this.get('duration') * componentX / rect.width;
    this.dispatch('seek', position);
  },

  render() {
    const idle = this.get('idle');
    const playing = this.get('playing') && !idle;
    var current = null;
    if (this.get('current') && !idle) {
      const track = this.get('current').toJS();
      current = <div className='Player-Current'>{`${track.artist} - ${track.name}`}</div>;
    }
    var playhead = null;
    if (this.get('progress') !== null && this.get('duration') !== null && !idle) {
      const currentTime = numeral(this.get('progress')).format('00:00');
      const durationTime = numeral(this.get('duration')).format('00:00');
      playhead = (
        <div className='Player-Playhead'>
          <progress onClick={this.seek} className='Player-Progress' value={this.get('progress')} max={this.get('duration')} />
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
