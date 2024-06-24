# 基本支持

## 构建工具

webpack + babel。

支持es6 class， 箭头函数，装饰器。

同时支持ts和js。

## 内置库
mobx, antd

# 使用

```bash
# 开发
npm install
npm start

# 构建线上使用包
npm run build

# 预览线上效果
npm server
```

# 配置里的一些常见问题

decorator 因为各种历史原因，babel配置的时候经常会遇到一些麻烦。

大多数会遇到的问题是class 和decorator一起使用的问题： https://github.com/electron-userland/electron-webpack/issues/251

另外注意，作为插件，可以从`.babelrc`中读取配置，也可能有其他入口 ，比如在webpack的loader中写的配置，优先级高于`.babelrc`
