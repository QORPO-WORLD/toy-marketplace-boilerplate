// webpack.config.js
module.exports = {
  // ... other configurations
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['./styles'],
              },
            },
          },
        ],
      },
    ],
  },
};
