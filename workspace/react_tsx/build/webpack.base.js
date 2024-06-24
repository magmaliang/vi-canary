const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { ProgressPlugin } = require("webpack")
let progressPlugin = new ProgressPlugin({
  activeModules: true,         // 默认false，显示活动模块计数和一个活动模块正在进行消息。
  entries: true,  			   // 默认true，显示正在进行的条目计数消息。
  modules: false,              // 默认true，显示正在进行的模块计数消息。
  modulesCount: 5000,          // 默认5000，开始时的最小模块数。PS:modules启用属性时生效。
  profile: false,         	   // 默认false，告诉ProgressPlugin为进度步骤收集配置文件数据。
  dependencies: false,         // 默认true，显示正在进行的依赖项计数消息。
  dependenciesCount: 10000,    // 默认10000，开始时的最小依赖项计数。PS:dependencies启用属性时生效。
})


module.exports = {
  mode: "production",
  entry:  path.resolve(__dirname, '../src/index.tsx') ,
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    progressPlugin,
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html')
    })
  ]
};