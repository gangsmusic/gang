var Immutable = require('immutable');


function immutableEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var key;
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || !Immutable.is(objA[key], objB[key]))) {
      return false;
    }
  }
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}


exports.shouldComponentUpdate = function(nextProps, nextState) {
    return !immutableEqual(this.state, nextState) ||
           !immutableEqual(this.props, nextProps);
};
