
## 简介

typescript + react + sass/less + webpack5
项目使用type script构建，因此没有使用`babel-loader`。


## 目录

多数目录有`readme.md`。

## 使用

开发
```bash
npm install
npm start
```

构建，预览
```bash
npm run build
#然后去server下执行node index.js即可
```

## 关于alias
因为ts的编译（以及语法提示）走的是它自己的配置，而webpack走的也是自己的配置。

多数情况下两者本属于不同的领域，因此没有问题，但是path alias是两者交差的地方，所以需要额外的解决方案。

这就用到了 `tsconfig-paths-webpack-plugin`

这可以将alias写在tsconfig中，然后让webpack使用此plugin去读。
