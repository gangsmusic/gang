const Immutable = require('immutable');

module.exports = Immutable.fromJS({
  duration: null,
  progress: null,
  current: null,
  playing: false,
  idle: true,
  volume: 0,
  playQueue: []
});
