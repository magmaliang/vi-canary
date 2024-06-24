
## 简介
typescript + react + sass/less + webpack5

## 快速开始

```bash
# 启动
yarn install
yarn start

# webpack编译
yarn build

# tsc 编译
yarn esbuild
```


## 关于alias
因为ts的编译（以及语法提示）走的是它自己的配置，而webpack走的也是自己的配置。

多数情况下两者本属于不同的领域，因此没有问题，但是path alias是两者交差的地方，所以需要额外的解决方案。

这就用到了 `tsconfig-paths-webpack-plugin`

这可以将alias写在tsconfig中，然后让webpack使用此plugin去读。

## webpack一些常见配置

### 同时运行在node和浏览器中
```js
output: {
    //...
    libraryTarget: 'umd',
    globalObject: 'this'
  },
```


### externals
```js
 externals: {
    'react': 'react',
    "antd": "antd",
    "axios": "axios"
  }
```
