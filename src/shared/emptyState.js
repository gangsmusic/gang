const Immutable = require('immutable');

module.exports = Immutable.fromJS({
  duration: null,
  progress: null,
  current: null,
  playing: false,
  idle: true,
  seekable: false,
  volume: 100,
  playQueue: []
});
