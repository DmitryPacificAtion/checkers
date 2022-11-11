const path = require('path');

const commonConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};

module.exports = [
  {
    ...commonConfig,
    target: 'node',
    entry: './server.js',
    output: {
      path: path.resolve(__dirname, './public'),
      filename: 'index.js',
    },
    plugins: [],
  },
  {
    ...commonConfig,
    entry: './src/app.js',
    output: {
      path: path.resolve(__dirname, './public'),
      filename: 'index.js',
    },
  },
];
