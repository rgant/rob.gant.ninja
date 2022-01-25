/* eslint-env node, es2021 */
/* eslint indent: ["error", 2] */
'use strict';

const path = require('path');

module.exports = {
  entry: path.resolve('./src/index.html'),
  mode: 'production',
  module: {
    rules: [
      {
        generator: { filename: '[name][ext]' },
        test: /\.html$/iu,
        type: 'asset/resource',
        use: [
          // 'extract-loader',
          'html-loader',
        ],
      },
      {
        generator: { filename: 'js/[name].[contenthash][ext]' },
        test: /\.js$/iu,
        type: 'asset/resource',
      },
      {
        generator: { filename: 'css/[name].[contenthash][ext]' },
        test: /\.css$/iu,
        type: 'asset/resource',
      },
      {
        generator: { filename: 'img/[name].[contenthash][ext]' },
        test: /\.(gif|jpe?g|png|svg)$/iu,
        type: 'asset/resource',
      },
    ],
  },
  output: {
    clean: true,
    // filename: 'index.html',
    path: path.resolve('./dist'),
  },
  resolve: { roots: [path.resolve('./src')] },
};
