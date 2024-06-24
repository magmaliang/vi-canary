## 通信方式

`sidePanel` 无法直接与 `content` 通信，但是 `sidePanel`、`content` 和 `background` 都可以通信。

所以通信实现有点绕。

暂时出于信能的考虑，不使用持久通道。

## 获取com-tree最新数据的方式

content 和网页之间的 js 是隔离的。

content 可以访问 目标网页的 dom， localStorage