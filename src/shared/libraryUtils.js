const Immutable = require('immutable');

exports.load = function load(data) {
  return Immutable.fromJS(data);
};

exports.addTrack = function addTrack(data, library) {
  return library.push(Immutable.fromJS(data));
};
