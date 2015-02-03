import React    from 'react';
import numeral  from 'numeral';


require('./Player.styl');

var Player = React.createClass({

  mixins: [require('./GangComponent')],

  play() {
    this.dispatch('play');
  },

  pause() {
    this.dispatch('pause');
  },

  render() {
    var current = null;
    if (this.get('current')) {
      const track = this.get('current').toJS();
      current = <div className='Player-Current'>{`${track.artist} - ${track.name}`}</div>;
    }
    var playhead = null;
    if (this.get('progress') !== null && this.get('duration') !== null) {
      const currentTime = numeral(this.get('progress')).format('00:00');
      const durationTime = numeral(this.get('duration')).format('00:00');
      playhead = (
        <div className='Player-Playhead'>
          <progress className='Player-Progress' value={this.get('progress')} max={this.get('duration')} />
          <div className='Player-Time'>{`${currentTime} / ${durationTime}`}</div>
        </div>
      );
    }
    return (
      <div className='Player'>
        <button onClick={this.play} disabled={this.get('playing')}>play</button>
        <button onClick={this.pause} disabled={!this.get('playing')}>pause</button>
        {current}
        {playhead}
      </div>
    );
  }

});

module.exports = Player;
