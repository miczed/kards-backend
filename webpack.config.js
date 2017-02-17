var Webpack = require('webpack');
var Path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var BUILD_DIR = Path.resolve(__dirname, 'dist');
var APP_DIR = Path.resolve(__dirname, 'src');

var config = {

  entry: APP_DIR + '/index.jsx',

  output: {
    path: BUILD_DIR + '/js',
    filename: 'bundle.js'
  },

  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },

  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'] }
    })
  ]

};

module.exports = config;