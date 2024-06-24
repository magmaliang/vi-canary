const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const inquirer = require("inquirer");
const path = require('path');

var styles = {
  'bold'          : ['\x1B[1m',  '\x1B[22m'],
  'italic'        : ['\x1B[3m',  '\x1B[23m'],
  'underline'     : ['\x1B[4m',  '\x1B[24m'],
  'inverse'       : ['\x1B[7m',  '\x1B[27m'],
  'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
  'white'         : ['\x1B[37m', '\x1B[39m'],
  'grey'          : ['\x1B[90m', '\x1B[39m'],
  'black'         : ['\x1B[30m', '\x1B[39m'],
  'blue'          : ['\x1B[34m', '\x1B[39m'],
  'cyan'          : ['\x1B[36m', '\x1B[39m'],
  'green'         : ['\x1B[32m', '\x1B[39m'],
  'magenta'       : ['\x1B[35m', '\x1B[39m'],
  'red'           : ['\x1B[31m', '\x1B[39m'],
  'yellow'        : ['\x1B[33m', '\x1B[39m'],
  'whiteBG'       : ['\x1B[47m', '\x1B[49m'],
  'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],
  'blackBG'       : ['\x1B[40m', '\x1B[49m'],
  'blueBG'        : ['\x1B[44m', '\x1B[49m'],
  'cyanBG'        : ['\x1B[46m', '\x1B[49m'],
  'greenBG'       : ['\x1B[42m', '\x1B[49m'],
  'magentaBG'     : ['\x1B[45m', '\x1B[49m'],
  'redBG'         : ['\x1B[41m', '\x1B[49m'],
  'yellowBG'      : ['\x1B[43m', '\x1B[49m']
}

function log (key, obj) {
  if (typeof obj === 'string') {
      console.log(styles[key][0] + '%s' + styles[key][1], obj)
  } else if (typeof obj === 'object') {
      console.log(styles[key][0] + '%o' + styles[key][1], obj)
  } else {
      console.log(styles[key][0] + '%s' + styles[key][1], obj)
  }
}

/**
 * 超大字体
 * @param {*} tips 
 */
 const bigTip = (tips) => {
  console.log(
    chalk.green(
      figlet.textSync(tips, {
        font: "big",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
};


const askForFolderName = () => {
  const questions = [
    {
      name: "folderName",
      type: "input",
      message: "请输入组件目录名(将在当前目录下创建此目录并初始化):"
    }
  ];
  return inquirer.prompt(questions);
};

const createFolder = (folderName) => {
  const folderPath = `${process.cwd()}/${folderName}`
  shell.mkdir(folderPath);
  return folderPath;
};

const execCmd = async (cmd, fName = false) => {
  const template_path = path.resolve(__dirname, `../workspace/${cmd}`)

  let folderName = null;

  if (fName) {
    folderName = fName
  } else {
    const answers = await askForFolderName();
    folderName = answers.folderName;
  }

  const folderPath = createFolder(folderName);

  // copy to folder created
  // shell.cp('-R', `${template_path}/`, `${folderPath}/`); cp有BUG
  shell.exec(`cp -R  ${template_path}/.  ${folderPath}/`)

  log('green', `创建组件模板成功： ${folderName}`)

  return;
};

/**
 * copy remote repo to local folder
 * @param {*} repoUrl 仓库地址
 * @param {*} repoName 仓库名
 * @param {*} fName 本地存放目录
 * @returns 
 */
const copyRepo = async (repoUrl, repoName, fName = false) => {
  let folderName = null;

  if (fName) {
    folderName = fName
  } else {
    const answers = await askForFolderName();
    folderName = answers.folderName;
  }

  const folderPath = createFolder(folderName);

  // git clone remote repo
  shell.cd(folderPath);

  shell.exec(`git clone ${repoUrl}`);
  shell.cp('-R', `./${repoName}/*`, `./`);
  shell.rm('-rf', `./${repoName}`);
  shell.rm('-rf', `.git`);

  log('green', `创建仓库成功： ${folderName}`)

  return;
};

module.exports = {
  log,
  bigTip,
  execCmd,
  copyRepo
}