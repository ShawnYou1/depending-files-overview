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
    recursiveFolder(config.ROOT_FOLDER, config.ROOT_PATH, fileTree, fileTree.pathToId);

    // loop and build depending tree
    fileTree.loop((node) => {
        let totalPath = `${node.filePath}/${node.fileName}`;

        if (node.type === 'file') {
            let content = fs.readFileSync(totalPath, 'utf8');
            node.deps = getAllModule(content, node.filePath + '/', fileTree.pathToId);
        }
    });

    // clean the node filePath
    fileTree.loop((node) => {
        let folderQueen = node.filePath.split('/');
        node.filePath = folderQueen[folderQueen.length - 1];
    });

    console.log(JSON.stringify(fileTree));

    return ;
}


// recursion a folder
// @_folder {String} folder's name
// @aPath {String} a path like /folder1/subFolder2  /folder1/file1.js
// @_fileTree {Filetree}
function recursiveFolder(_folder, aPath, _fileTree, _pathToId) {

    let node = new Node(utils.uniqueId(), _folder, aPath, 'folder');
    _fileTree.addNode(node);

    let folderTotalDir = `${aPath}/${_folder}`

    // convenient to convert
    _pathToId[node.id] = folderTotalDir;
    _pathToId[folderTotalDir] = node.id;

    let stats, newPath;
    let dirList = fs.readdirSync(folderTotalDir);
    dirList.forEach((name) => {
        newPath = `${folderTotalDir}/${name}`;
        stats = fs.statSync(newPath);
        if (stats.isDirectory()) {
            recursiveFolder(name, folderTotalDir, _fileTree, _pathToId);
        } else {
            if (/\.(js|ts)$/.test(name)) {
                let node = new Node(utils.uniqueId(), name, folderTotalDir, 'file');

                // let file node leaves equels null
                node.leaves = null;
                _fileTree.addNode(node);
                // convenient to convert
                _pathToId[node.id] = folderTotalDir + '/' + name;
                _pathToId[folderTotalDir + '/' + name] = node.id;
            }
        }
    });
}


// get all module
// @content {String} file's content
// @currentPath {String} current file's path
// @return {Array} all module path with root path
function getAllModule(content, currentPath, _pathToId) {
  let rt = [];
  let modulesPath = content.match(config.MODULE_PATH_REG);

  if (Array.isArray(modulesPath)) {
    rt = modulesPath.map((str) => {
      let modulePath = utils.parse(str);
      let fixedPath = utils.fixPath(modulePath, currentPath);
      return _pathToId[fixedPath];
    });
  }

  return rt;
}


