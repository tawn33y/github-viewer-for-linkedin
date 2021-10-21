const path = require('path');
const webpack = require('webpack');

require('dotenv').config();

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    index: './src/index.ts',
    background: './src/background.ts',
    popup: './src/popup.ts',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        GITHUB_AUTH_TOKEN: process.env.GITHUB_AUTH_TOKEN,
      }),
    }),
  ],
};