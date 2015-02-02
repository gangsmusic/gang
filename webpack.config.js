var os = require('os');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = {
  entry: [
    'stylus-normalize/normalize.styl',
    'fixed-data-table/dist/fixed-data-table.css',
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '',
    filename: '[hash].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.styl$/,
        loader: 'style!css!stylus'
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg|gif|png|jpg|mp3|mp4|webm|ogg)(\?.+)?$/,
        loader: 'file-loader?name=[sha512:hash:base36:7].[ext]'
      },
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'jsx?harmony&es5'],
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'inline-sourcemap',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'gang'
    })
  ]
};

module.exports = config;
