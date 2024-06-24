const baseConfig = require('./webpack.base')
const Merge = require("webpack-merge").merge
const path = require('path')

module.exports = Merge([baseConfig, {
  mode: "development",
  entry:  {
    "index": path.resolve(__dirname, '../src/index.tsx'),
    "store":  path.resolve(__dirname, '../src/store.ts')
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    "antd": "antd",
    "mobx": "mobx",
    "mobx-react": "mobx-react"
  }
}])