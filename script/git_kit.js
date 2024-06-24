const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

/** 
 * download a sub folder of a git repo, saved it in the [stored_in_path]
 * make sure you have the git repo access right
 * @param {*} git_url 
 * @param {*} branch 
 * @param {*} sub_path 
 * @param {*} stored_in_path 
 */
async function download_partial(git_url, branch = 'master', sub_path = "", stored_in_path) {
  // Ensure the URL is for a GitHub repository
  if (!git_url.includes('github.com')) {
    throw new Error('The provided URL is not a valid GitHub repository URL.');
  }

  // Extract user/repo and branch info from the git URL
  const parts = git_url.split('/');
  if (parts.length < 5) {
    throw new Error('The provided URL does not seem to be a complete GitHub repository URL.');
  }

  const user = parts[parts.length - 2];
  const repo = parts[parts.length - 1];

  // Construct the URL for the specific subdirectory archive
  let archive_url = `https://github.com/${user}/${repo}/archive/refs/heads/${branch}.zip`;
  if (sub_path) {
    archive_url += `?path=${sub_path}`
  }

  console.log("===> download template from: ", archive_url)

  try {
    // Download the zip file
    const response = await axios.get(archive_url, { responseType: 'arraybuffer' });

    // Create an instance of AdmZip with the downloaded data
    const zip = new AdmZip(response.data);

    // Extract all files to the specified directory
    zip.getEntries().forEach(entry => {
      const entryName = entry.entryName;

      // Check if the entry is part of the subdirectory
      if (entryName.startsWith(`${repo}-${branch}/${sub_path}/`)) {
        const relativePath = path.relative(`${repo}-${branch}/${sub_path}`, entryName);
        const outputPath = path.join(stored_in_path, relativePath);

        if (entry.isDirectory) {
          // Create directory
          fs.mkdirSync(outputPath, { recursive: true });
        } else {
          // Write file
          const data = entry.getData();
          fs.writeFileSync(outputPath, data);
        }
      }
    });
  } catch (error) {
    throw new Error(`Failed to download and extract subdirectory: ${error.message}`);
  }
}

// // Example usage
// download_partial("https://github.com/user/repo", "subdirectory_path", "local_storage_path")
//   .then(() => console.log('Download and extraction complete.'))
//   .catch(err => console.error('Error:', err.message));

module.exports = {
  download_partial
}
