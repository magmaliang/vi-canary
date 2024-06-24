
## 支持的一般参数

--tsx: 支持ts 和tsx
--name="xxx": 目录名为'xxx'
--webpack: 构建工具为webpack
--vite: 构建工具为vite

```bash
# 在当前目录下的react_demo/下，创建一个支持react tsx，使用webpack初始化的项目脚手架
vica react --webpack --tsx --name="./react_demo"
# name不传时，表示在当前目录下创建一个./vica_react
vica react --webpack --tsx
```

## scaffold 分类

- react
- vue
- lib, 创建一个用于发布lib包的脚手架， 构建工具固定为rollup，因此不支持--vite
