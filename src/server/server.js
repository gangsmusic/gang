const path = require('path');
const debug = require('debug');
const SocketIO = require('socket.io');
const S = require('string');
const Immutable = require('immutable');
const portfinder = require('portfinder');
const open = require('open');
const itunesLoader = require('./itunes-loader');
const {getLocalAddrs, PingMonitor} = require('./util');
import LocalPartyStore from '../LocalPartyStore';
import LibraryStore from '../LibraryStore';
import Dispatcher from '../Dispatcher';
import DiscoveryService from './DiscoveryService';
import PlayerService from './PlayerService';
import TaggingService from './TaggingService';
import ActionTypes from '../ActionTypes';
import {bootstrapStores, loadLibrary} from '../Actions';
import mm from 'musicmetadata';

const connectionDebug = debug('gang:connection');
const eventDebug = debug('gang:event');
const broadcastDebug = debug('gang:broadcast');

const SERVICES = [
  DiscoveryService,
  PlayerService,
  TaggingService
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

  io.on('connection', function(socket:SocketIO.Socket) {
    socket.on('client', function() {
      connectionDebug('connected');
      socket.emit('dispatch-action', bootstrapStores());
      socket.on('dispatch-action', action => Dispatcher.dispatch(action));
    });
    socket.on('server', function() {
      connectionDebug('server connected');
      socket.emit('manifest', {
        version: 'git'
      });
    });
  });

  Dispatcher.register(action => {
    if (action.origin === 'server') {
      sendBroadcast('dispatch-action', action);
    }
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
