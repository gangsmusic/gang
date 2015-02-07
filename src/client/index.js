if (typeof Object.assign === 'undefined') {
  Object.assign = require('react/lib/Object.assign');
}

if (process.env.NODE_ENV !== 'production') {
  require('debug').enable('gang:*');
}

import React from 'react/lib/ReactWithAddons';
import App from './App';

React.initializeTouchEvents(true);
React.render(<App />, document.body);
