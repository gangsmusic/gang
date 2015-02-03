var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var debug = require('debug');
var fs = require('fs');
var Immutable = require('immutable');
var config = require('../../webpack.config');

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

var state = require('../shared/emptyState');

// state = state.set('tracks', JSON.parse(fs.readFileSync('itunes-library.json', 'utf-8')));

var conectionDebug = debug('gang:connection');
var eventDebug = debug('gang:event');
var broadcastDebug = debug('gang:broadcast');

import * as actions from '../shared/actions';
import S from 'string';

import Player from './Player';

const player = new Player;

function executeAction(name) {
  if (actions[name]) {
    var newState = actions[name](state);
    if (!Immutable.is(newState, state)) {
      state = newState;
      broadcastDebug('action', name);
      io.sockets.emit('action', name);
    }
  }
}

function mergeState(data) {
  var newState = state.mergeDeep(data);
  if (!Immutable.is(newState, state)) {
    state = newState;
    broadcastDebug('state', S(JSON.stringify(data)).truncate(120).s);
    io.sockets.emit('state', data);
  }
}

player.on('stop', function() {
  mergeState({
    playing: false,
    duration: null,
    progress: null
  });
});

player.on('progress', function(progress) {
  mergeState({progress});
});

player.on('duration', function(duration) {
  mergeState({duration});
});

player.on('pause', function() {
  mergeState({playing: false});
});

player.on('play', function() {
  mergeState({playing: true});
});

io.on('connection', function(socket) {
  conectionDebug('connected');

  socket.emit('state', state);

  socket.on('event', function(data) {
    eventDebug(data.type, data.payload);

    if (data.type === 'state') {
      mergeState(data.payload);
    } else if (data.type === 'action') {
      if (actions[data.payload]) {
        executeAction(data.payload);
      }
    } else if (data.type === 'play') {
      if (data.payload) {
        mergeState({current: data.payload});
        player.play(data.payload.url);
      } else {
        player.play();
      }
    } else if (data.type === 'pause') {
      player.pause();
    }

  });
});


import itunesLoader from './itunes-loader';

itunesLoader().then(tracks => mergeState({tracks}));

