const baseConfig = require('./webpack.base')
const Merge = require("webpack-merge").merge
const path = require("path")

module.exports = Merge([baseConfig, {
  mode: "development",
  cache: false,
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: false,
    port: 9000,
    // 开发时监控任何位置的变化，方便调试
    watchFiles: [ path.join(__dirname, '../src'), path.join(__dirname, '../node_modules')]
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../src/react/react.js'),
      'react-dom': path.resolve(__dirname, '../src/react/react-dom.js')
    },
  },
}])