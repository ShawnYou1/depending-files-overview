const fs = require('fs');
const config = require('./config');

let Node = require('./node');
let Filetree = require('./fileTree');
let utils = require('./utils');

main();

function main() {

    // init a  empty file tree
    let fileTree = new Filetree();

    // build file path tree
    recursivePath(config.ROOT_FOLDER, config.ROOT_PATH, fileTree);

    // loop and build depending tree
    fileTree.loop((node) => {
        if (node.type === 'file') {
            let totalPath = `${node.filePath}/${node.fileName}`;
            let content = fs.readFileSync(totalPath, 'utf8');
            node.deps = getAllModule(content, node.filePath + '/');
        }
    });

    console.log(JSON.stringify(fileTree));
    return ;
}


// recursion a folder
// @_folder {String} folder's name
// @aPath {String} a path like /folder1/subFolder2  /folder1/file1.js
// @_fileTree {Filetree}
function recursivePath(_folder, aPath, _fileTree) {
    let node = new Node(_folder, aPath, 'folder');
    _fileTree.addNode(node);

    let folderTotalDir = `${aPath}/${_folder}`
    let dirList = fs.readdirSync(folderTotalDir);

    let stats, newPath;
    dirList.forEach((name) => {
        newPath = `${folderTotalDir}/${name}`;
        stats = fs.statSync(newPath);
        if (stats.isDirectory()) {
            recursivePath(name, folderTotalDir, _fileTree);
        } else {
            if (/\.(js|ts)$/.test(name)) {
                let node = new Node(name, folderTotalDir, 'file');
                _fileTree.addNode(node);
            }
        }
    });
}


// get all module
// @content {String} file's content
// @currentPath {String} current file's path
// @return {Array} all module path with root path
function getAllModule(content, currentPath) {
  let rt = [];
  let modulesPath = content.match(config.MODULE_PATH_REG);

  if (Array.isArray(modulesPath)) {
    rt = modulesPath.map((str) => {
      let modulePath = utils.parse(str);
      let fixedPath = utils.fixPath(modulePath, currentPath);
      // console.log('fixed', fixedPath);
      return fixedPath;
    });
  }

  return rt;
}


