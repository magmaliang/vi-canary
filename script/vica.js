#!/usr/bin/env node

const {log, bigTip, execCmd} = require("./utils")
const fs = require("fs")
const path = require('path')
const npmPkgApi = require('npm-pkg-api')
const { getCmdFnFromLine, registerCmd, getCmdFn} = require("./cmd")

function getVersion() {
  var json = fs.readFileSync(path.resolve(__dirname, '../package.json'))
  return JSON.parse(json).version
}

/**
 * 异步获取最新版本，并存储于当前目录
 * @returns 
 */
function getRemoteVersion() {
  return npmPkgApi.target('vica').latest
}

function help() {
  bigTip("vica : " + getVersion())
  log("green", "viCanary's  cli for fe daily-work ... ")
  log("green", "      -----部分模板存储于gitEE上，需要gitEE的配置。")
  log('green', `
    =[基本脚手架]==========================================================
    vica common_wk          在当前目录下创建一个webpack tsx项目, 使用ts-loader
    vica common_es6         和common_wk一样，只是使用babel
    vica react_tsx          在当前目录下创建react + tsx + webpack 的工程
    vica vite_tsx           在当前目录下创建react + tsx + vite 的工程
    vica lib_dev            在当前目录下创建一个lib开发的初始项目
    =[源码解析]============================================================
    vica react_source       在当前目录下创建一个解析react源码的工程
    =[一些概念POC]=========================================================
    vica layout             创建一个演示css-grid布局能力的概念demo
    vica event_action       创建一个演示 amis event_action的概念demo
  `)
}

// setTimeout(() => {
//   if (getVersion().trim() !== getRemoteVersion().trim()) {
//     log("yellow", `\nlatest version is ${getRemoteVersion()}, pls update to make sure cli workable`)
//   }
// })

registerCmd("common_wk", {
  // tsx: true,
  // webpack: true
}, (options) => {
  execCmd('common_wk', options.name)
})

registerCmd("common_es6", {}, (options) => {
  execCmd('common_es6', options.name)
})

registerCmd("react_tsx", {}, (options) => {
  execCmd('react_tsx', options.name)
})

registerCmd("vite_tsx", {}, (options) => {
  execCmd('vite_tsx', options.name)
})

registerCmd("react_source", {}, (options) => {
  execCmd('react_source', options.name)
})

registerCmd("help", {}, (options) => {
  help()
})

registerCmd(undefined, {}, (options) => {
  help()
})

registerCmd("version", {}, (options) => {
  log("green", getVersion())
})

registerCmd("info", {}, (options) => {
  log("green", `latest version: ${getRemoteVersion()}`)
})


let cmdFunction = getCmdFnFromLine(process.argv);

if (cmdFunction) {
  cmdFunction()
} else {
  help()
}