var fs = require('fs');
var os = require('os');
var path = require('path');
var webpack = require('webpack');
var ExternalsPlugin = require('webpack/lib/ExternalsPlugin');

var nodeModules = fs.readdirSync('node_modules').filter(function(x) { return x !== '.bin' });

var config = {
  entry: './src/server/server',
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '',
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeModules,
  resolve: {
    extensions: ['', '.js', '.json']
  },
  target: 'atom',
  node: {
    __filename: false,
    __dirname: false
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?experimental',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};

module.exports = config;
