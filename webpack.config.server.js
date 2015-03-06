var os = require('os');
var path = require('path');
var webpack = require('webpack');
var ExternalsPlugin = require('webpack/lib/ExternalsPlugin');

var config = {
  entry: './src/server/server',
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '',
    filename: 'server.js'
  },
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
    new ExternalsPlugin('commonjs', ['socket.io']),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // new webpack.optimize.UglifyJsPlugin({compress: {
    //   warnings: false
    // }})
  ]
};

module.exports = config;
