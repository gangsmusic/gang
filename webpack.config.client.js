var os = require('os');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var prod = process.env.NODE_ENV === 'production';

var entry = [
  './src/client/index'
];

if (!prod) {
  entry = [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server'
  ].concat(entry);
}

var config = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '',
    filename: 'client.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg|gif|png|jpg|mp3|mp4|webm|ogg)(\?.+)?$/,
        loader: 'file-loader?name=[sha512:hash:base36:7].[ext]'
      },
      {
        test: /\.js$/,
        loaders: prod ? ['6to5?experimental'] : ['react-hot', '6to5?experimental'],
        exclude: /\bnode_modules\b/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/client/index.html.tmpl'
    }),
  ]
};

if (!prod) {
  config.devtool = 'inline-sourcemap';
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  // config.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {
  //     warnings: false
  //   }})
  // );
}

module.exports = config;
