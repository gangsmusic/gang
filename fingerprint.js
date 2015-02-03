/**
 * Audio fingerprinting PoC.
 *
 * 1. brew install chromaprint
 * 2. Don't go with this key in production.
 */
'use strict';

var acoustid  = require('acoustid');
var path      = require('path');

acoustid(require.resolve(process.argv[2]), {key: 'dUThn8Rt'}, function callback(err, results) {
  if (err) {
    throw err;
  }
  console.log(JSON.stringify(results, null, 2));
});
