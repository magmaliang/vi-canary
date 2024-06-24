
## 简介
主要研究react的源码, react 版本：  `'16.14.0'`


参考：
- [React Fiber 架构原理：关于 Fiber 树的一切](https://zhuanlan.zhihu.com/p/525244896)

## 本项目
本项目主要用于研究react, react-dom这两个库的内部细节，可以认为是源码研究。

因此`src/react`目录下本地化了react 和 react-dom两个库，进行了一些修改

## 关联工具库

### SuperTrace
实现了一个库，可以形成session级别的callback Trace日志，以树形结构的方式展现打日志的函数之间的调用关系

### FiberNodeAvatar(未完成)
实现了一个库，可视化展现fiberNodeTree的运行状态

## 逻辑删减
为了突出核心逻辑，对 `react` 和 `react-dom`的仓库都做了一些删减：

### react-dom

- 一些兼容性处理
- 删除了hydrate逻辑
- 删除了入口render的callback逻辑

### react

- 一些非浏览器特性
- 一些兼容性处理


