const baseConfig = require('./webpack.base')
const Merge = require("webpack-merge").merge
const webpack = require("webpack")

module.exports = Merge([baseConfig, {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true
    })
  ]
}])