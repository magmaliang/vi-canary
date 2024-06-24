const baseConfig = require('./webpack.base')
const Merge = require("webpack-merge").merge

module.exports = Merge([baseConfig, {
  mode: "production"
}])