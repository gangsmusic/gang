if (typeof Object.assign === 'undefined') {
  Object.assign = require('react/lib/Object.assign');
}

if (process.env.NODE_ENV !== 'production') {
  require('debug').enable('gang:*');
}

var React = require('react/lib/ReactWithAddons');
var App = require('./App');

React.initializeTouchEvents(true);
React.render(<App />, document.body);
