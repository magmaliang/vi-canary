const {log, execCmd} = require("./utils")

let args = process.argv.slice(2)
let cmd = args.shift()
let params = args

module.exports = {
  default: () => {
    execCmd('event_action', params.pop())
  }
}