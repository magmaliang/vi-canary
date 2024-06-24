/**
 * get a cmd from command line:
 * 
 * ["react", "--webpack", "--tsx", "--name=./react_demo"];
 * => {cmd: "react", options: {webpack: true, tsx: true, name: "./react_demo"}}
 * @param {*} args 
 * @returns 
 */
function parseCommand(args) {
  if (!Array.isArray(args)) {
    throw new Error("args should be an array of strings.");
  }

  // Initialize the result object
  const result = {
    cmd: args[0],
    options: {}
  };

  // Iterate through the array
  args.slice(1).forEach(arg => {
    if (arg.startsWith('--')) {
      // Remove the leading '--' and split by '='
      const [key, value] = arg.slice(2).split('=');
      result.options[key] = value === undefined ? true : value;
    }
  });

  return result;
}

const cmd_array = []

/**
 * register a cmd with options and fn
 * @param {*} cmd 
 * @param {*} options 
 * @param {*} fn function to execute when cmd is called
 */
function registerCmd(cmd, options, fn) {
  cmd_array.push({cmd, options, fn})
}

/**
 * 
 * @param {*} cmd 
 * @param {*} options 
 * @returns 
 */
function getCmdFn(cmd, options) {
  let matched = cmd_array.filter(item => item.cmd === cmd);
  if (matched.length === 0) {
    throw new Error(`cmd ${cmd} not found`);
  }

  // find every field of options matched cmd
  matched = matched.filter(item => {
    for (const key in item.options) {
      if (item.options[key] !== options[key]) {
        return false;
      }
    }

    return true;
  })

  if (matched.length == 1) {
    return matched[0].fn.bind(null, options)
  } else {
    throw new Error(`cmd ${cmd} with options ${JSON.stringify(options)} not found`);
  }
}

function getCmdFnFromLine(line) {
  const {cmd, options} = parseCommand(line.slice(2))
  return getCmdFn(cmd, options)
} 


module.exports = {
  getCmdFnFromLine,
  registerCmd,
  getCmdFn
}