const path = require('path');
const debug = require('debug');
const fs = require('fs');
const SocketIO = require('socket.io');
const S = require('string');
const Immutable = require('immutable');
const portfinder = require('portfinder');
const open = require('open');
const MPV = require('./mpv');
const itunesLoader = require('./itunes-loader');
const {getLocalAddrs, PingMonitor} = require('./util');
import LocalPartyStore from '../LocalPartyStore';
import LibraryStore from '../LibraryStore';
import PlayerStore from '../PlayerStore';
import Dispatcher from '../Dispatcher';
import DiscoveryService from './DiscoveryService';
import {bootstrapStores, loadLibrary, updatePlayerState} from '../Actions';

const connectionDebug = debug('gang:connection');
const eventDebug = debug('gang:event');
const broadcastDebug = debug('gang:broadcast');

const SERVICES = [
  DiscoveryService
];


function start(ioPort) {
  const webpackPort = ioPort + 1;

  const io = new SocketIO(ioPort);
  connectionDebug('api listening on 0.0.0.0:' + ioPort);

  SERVICES.forEach(serviceClass => {
    let config = {};
    let service = new serviceClass(config);
    service.start();
    // TODO: make it work, currently it just makes weird things to shutdown
    // process
    //process.on('beforeExit', service.stop);
    //process.on('SIGINT', service.stop);
  });

  const player = new MPV;

  if (process.env.NODE_ENV !== 'production') {

    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const webpackConfig = require('../../webpack.config.client');
    webpackConfig.entry[0] = webpackConfig.entry[0].replace(':3000', ':' + webpackPort);
    new WebpackDevServer(webpack(webpackConfig), {
      publicPath: webpackConfig.output.publicPath,
      hot: true,
      stats: {colors: true, modules: false, chunks: false}
    }).listen(webpackPort, undefined, 511, function(err) {
        if (err) {
          connectionDebug('webpack listen failed', err);
        } else {
          connectionDebug('webpack listening on 0.0.0.0:' + webpackPort);
        }
      });

  }

  /**
   * send event to all connected clients
   * @param {string} name
   * @param {any} data
   */
  function sendBroadcast(name, data) {
    broadcastDebug(name, S(JSON.stringify(data)).truncate(120).s);
    io.sockets.emit(name, data);
  }

  itunesLoader().then(tracks => loadLibrary(tracks));

  player.on('playing', playing => updatePlayerState({playing}));
  player.on('progress', progress => updatePlayerState({progress}));
  player.on('duration', duration => updatePlayerState({duration}));
  player.on('idle', idle => updatePlayerState({idle}));
  player.on('volume', volume => updatePlayerState({volume}));
  player.on('seekable', seekable => updatePlayerState({seekable}));

  /**
   * handle data from client connection
   * @param {string} type
   * @param {any} payload
   */
  function handleClientEvent(type, payload) {
    eventDebug(type, payload);
    switch(type) {
      case 'play':
        if (payload) {
          updatePlayerState({current: payload});
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
      case 'volume':
        player.setVolume(payload);
        break;
      default:
        throw new Error(`unsupported event type ${type}`);
    }
  }

  io.on('connection', function(socket:SocketIO.Socket) {
    socket.on('client', function() {
      connectionDebug('connected');
      socket.emit('dispatch-action', bootstrapStores());
      socket.on('event', ({type, payload}) => handleClientEvent(type, payload));
    });
    socket.on('server', function() {
      connectionDebug('server connected');
      socket.emit('manifest', {
        version: 'git'
      });
    });
  });

  Dispatcher.register(action => {
    sendBroadcast('dispatch-action', action);
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
      mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});
      if (process.env.NODE_ENV === 'production') {
        mainWindow.loadUrl('file://' + path.join(__dirname, 'index.html') + '?' + ioPort);
      } else {
        mainWindow.loadUrl('http://127.0.0.1:' + webpackPort + '?' + ioPort);
      }
      mainWindow.on('closed', function() {
        mainWindow = null;
      });
    }

    app.on('ready', openMainWindow);
    app.on('activate-with-no-open-windows', openMainWindow);
  } else {
    if (!process.env.DEBUG) {
      open('http://127.0.0.1:' + webpackPort + '?' + ioPort);
    }
  }

}

portfinder.basePort = 12001;

portfinder.getPort(function(err, ioPort) {
  if (err) {
    throw err;
  }
  start(ioPort);
});
