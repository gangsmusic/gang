var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var debug = require('debug');
var fs = require('fs');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  stats: { colors: true, modules: false, chunks: false }
}).listen(3000, undefined, 511, function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log('webpack listening on 0.0.0.0:3000');
  }
});

var Server = require('socket.io');
var io = new Server(3001);
console.log('api listenging on 0.0.0.0:3001');

var Immutable = require('immutable');
var state = require('./emptyState');

state = state.set('tracks', JSON.parse(fs.readFileSync('itunes-library.json', 'utf-8')));

var conectionDebug = debug('gang:connection');
var eventDebug = debug('gang:event');
var broadcastDebug = debug('gang:broadcast');

io.on('connection', function(socket) {
  conectionDebug('connected');

  socket.emit('state', state);

  socket.on('event', function(data) {
    eventDebug(data.type, data.payload);

    if (data.type === 'state') {
      var newState = state.mergeDeep(data.payload);
      if (!Immutable.is(newState, state)) {
        state = newState;
        broadcastDebug('state', state);
        io.sockets.emit('state', state);
      }
    }
  });
});
