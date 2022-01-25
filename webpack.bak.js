/* eslint-env node, es2021 */
/* eslint indent: ["error", 2] */
'use strict';
// const CopyPlugin = require('copy-webpack-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve('./src/index.html'),
  mode: 'production',
  module: {
    rules: [
      {
        generator: { filename: '[name][ext]' },
        test: /\.html$/u,
        type: 'asset/resource',
      },
      {
        test: /\.html$/iu,
        use: [
          path.resolve('./extract-loader/extract-loader.js'),
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
      // {
      //   test: /\.css$/iu,
      //   use: ['css-loader'],
      // },
      {
        generator: { filename: 'img/[name].[contenthash][ext]' },
        test: /\.(gif|jpe?g|png|svg)$/iu,
        type: 'asset/resource',
      },
    ],
  },
  // optimization: { minimizer: [new CssMinimizerPlugin()] },
  output: {
    clean: true,
    // filename: 'index.html',
    // path: path.resolve('./dist'),
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [
    //     { from: './src/.well-known', to: '.well-known', toType: 'dir' },
    //     { from: './src/assets', to: 'assets', toType: 'dir' },
    //     // { from: './src/js/vendor/jquery*', to: 'js' },
    //     { from: './src/resume.pdf' },
    //     { from: './src/robots.txt' },
    //   ],
    // }),
    // new HtmlWebpackPlugin({
    //   favicon: './src/favicon.ico',
    //   filename: 'index.html',
    //   template: './src/index.html',
    // }),
    // new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' }),
  ],
  resolve: { roots: [path.resolve('./src')] },
};
