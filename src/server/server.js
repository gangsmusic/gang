const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const debug = require('debug');
const fs = require('fs');
const SocketIO = require('socket.io');
const S = require('string');
const Immutable = require('immutable');
const MPV = require('./mpv');
const actions = require('../shared/actions');
const webpackConfig = require('../../webpack.config');
const itunesLoader = require('./itunes-loader');
const libraryUtils = require('../shared/libraryUtils');

var state = require('../shared/emptyState');
var library = require('../shared/emptyLibrary');

const connectionDebug = debug('gang:connection');
const eventDebug = debug('gang:event');
const broadcastDebug = debug('gang:broadcast');

const io = new SocketIO(3001);
connectionDebug('api listening on 0.0.0.0:3001');

const player = new MPV;

new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  stats: { colors: true, modules: false, chunks: false }
}).listen(3000, undefined, 511, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('webpack listening on 0.0.0.0:3000');
  }
});


function sendBroadcast(name, data) {
  broadcastDebug(name, S(JSON.stringify(data)).truncate(120).s);
  io.sockets.emit(name, data);
}


/**
 * execute action and broadcast state
 * @param {string} name
 */
function executeAction(name) {
  if (!actions[name]) {
    throw new Error(`unsupported action ${name}`);
  }
  const newState = actions[name](state);
  if (!Immutable.is(newState, state)) {
    state = newState;
    sendBroadcast('action', name);
  }
}

/**
 * merge and broadcast state
 * @param {object} data
 */
function mergeState(data) {
  const newState = state.mergeDeep(data);
  if (!Immutable.is(newState, state)) {
    state = newState;
    sendBroadcast('state', data);
  }
}

function executeLibraryUtilFn(name, payload) {
  const utilFn = libraryUtils[name];
  if (!utilFn) {
    throw new Error(`unknown library util function ${name}`);
  }
  const newLibrary = utilFn(payload, library);
  if (!Immutable.is(library, newLibrary)) {
    library = newLibrary;
    sendBroadcast('library', {name, payload});
  }
}

itunesLoader().then(tracks => executeLibraryUtilFn('load', {tracks}));

player.on('playing', playing => mergeState({playing}));
player.on('progress', progress => mergeState({progress}));
player.on('duration', duration => mergeState({duration}));
player.on('idle', idle => mergeState({idle}));
player.on('volume', volume => mergeState({volume}));

/**
 * handle data from client connection
 * @param {string} type
 * @param {any} payload
 */
function handleClientEvent(type, payload) {
  eventDebug(type, payload);
  switch(type) {
    case 'state':
      mergeState(payload);
      break;
    case 'action':
      executeAction(payload);
      break;
    case 'play':
      if (payload) {
        mergeState({current: payload});
        player.play(payload.url);
      } else {
        player.play();
      }
      break;
    case 'pause':
      player.pause();
      break;
    case 'seek':
      player.seek(payload);
      break;
    default:
      throw new Error(`unsupported event type ${type}`);
  }
}

io.on('connection', function(socket:SocketIO.Socket) {
  connectionDebug('connected');
  socket.emit('state', state);
  socket.emit('library', {name: 'load', payload: library});
  socket.on('event', ({type, payload}) => handleClientEvent(type, payload));
});

/**
 * If we are running inside atom-shell.
 */
if (process.versions['atom-shell']) {
  var app = require('app');
  var BrowserWindow = require('browser-window');

  require('crash-reporter').start();

  var mainWindow = null;

  app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
      app.quit();
  });

  function openMainWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadUrl('http://localhost:3000');
    mainWindow.on('closed', function() {
      mainWindow = null;
    });
  }

  app.on('ready', openMainWindow);
  app.on('activate-with-no-open-windows', openMainWindow);
}
