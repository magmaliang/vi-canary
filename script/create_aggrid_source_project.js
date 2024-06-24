const {log, copyRepo} = require("./utils")

let args = process.argv.slice(2)
let cmd = args.shift()
let params = args

module.exports = {
  default: () => {
    copyRepo('git@gitee.com:yan_bu_hui/aggrid-source.git', 'aggrid-source', params.pop())
  }
}