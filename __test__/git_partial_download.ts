const {download_partial} = require("../script/git_kit");
const path = require("path");

download_partial("https://github.com/magmaliang/dna", "src", path.join(__dirname, './src'))
  .then(() => console.log('Download and extraction complete.'))
  .catch(err => console.error('Error:', err.message));