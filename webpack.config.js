var Webpack = require('webpack');
var Path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var historyApiFallback = require('connect-history-api-fallback');
var CopyWebpackPlugin = require('copy-webpack-plugin');

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
        loaders: ["style-loader", "css-loader", 'postcss-loader',"sass-loader"]
      },
        { test: /\.css$/, loader: 'style-loader!css-loader'},
    ]
  },

  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'], middleware: [ historyApiFallback() ] }
    }),
      new CopyWebpackPlugin([ // Copies files from src asset folder to dist asset folder
          { from: APP_DIR + "/assets",
            to: BUILD_DIR + "/assets"
          }
      ])
  ],

    devtool: "#cheap-eval-source-map"

};

module.exports = config;
