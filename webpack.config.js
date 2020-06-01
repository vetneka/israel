const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  output: {
    filename: 'script.js',
  },
  mode: 'production',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules\/(?!(swiper|dom7)\/).*/],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  plugins: [
    // new BundleAnalyzerPlugin()
  ]
}

module.exports = config;
