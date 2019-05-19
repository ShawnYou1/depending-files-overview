const fs = require('fs');
const config = require('./config');

let Node = require('./node');
let Filetree = require('./fileTree');
let utils = require('./utils');

main();

function main() {

    // build file path tree
    let fileTree = buildFilePathTree();

    // build depending tree
    let depengingTree = buildDependingTree(fileTree);

    // clean the fileTree
    let cleaningDependingTree = cleanBuildFileTree(fileTree);

    console.log(JSON.stringify(cleaningDependingTree.rootNode));

    // draw relation diagram
    // TODO

}

// build file path tree
// @return {Filetree}
function buildFilePathTree() {
    return recursiveFolder(config.ROOT_FOLDER, config.ROOT_PATH, new Filetree());
}

// clean the build file tree
// @_fileTree {Filetree}
// @return {Filetree}
function cleanBuildFileTree(_fileTree) {
    _fileTree.loop((node) => {
        delete node.filePath;
    });

    return _fileTree;
}

// build depenging file tree
// @_cleaningFileTree {Filetree}
// @return {Filetree}
function buildDependingTree(_fileTree) {
    // loop storing depending node's id
    // deps: ['a/b/c', ...] => ['_id', ...]
    _fileTree.loop((node) => {
        let totalPath = `${node.filePath}/${node.fName}`;
        // no leaves indicate it just a file
        if (node.leaves === null) {
            let content = fs.readFileSync(totalPath, 'utf8');
            node.deps = getDependingIds(content, node.filePath + '/', _fileTree.pathToId);
        }
    });

    return _fileTree;
}


// recursion a folder
// @_folder {String} folder's name
// @aPath {String} a path like /folder1/subFolder2  /folder1/file1.js
// @_fileTree {Filetree}
function recursiveFolder(_folder, aPath, _fileTree) {

    let node = new Node(utils.uniqueId(), _folder, aPath);
    _fileTree.addNode(node);

    let folderTotalDir = `${aPath}/${_folder}`

    // convenient to convert
    _fileTree.pathToId[node.id] = folderTotalDir;
    _fileTree.pathToId[folderTotalDir] = node.id;

    let stats, newPath;
    let dirList = fs.readdirSync(folderTotalDir);
    dirList.forEach((name) => {
        newPath = `${folderTotalDir}/${name}`;
        stats = fs.statSync(newPath);
        if (stats.isDirectory()) {
            recursiveFolder(name, folderTotalDir, _fileTree);
        } else {
            if (/\.(js|ts)$/.test(name)) {
                let node = new Node(utils.uniqueId(), name, folderTotalDir);

                // let file node leaves equels null
                node.leaves = null;
                _fileTree.addNode(node);
                // convenient to convert
                _fileTree.pathToId[node.id] = folderTotalDir + '/' + name;
                _fileTree.pathToId[folderTotalDir + '/' + name] = node.id;
            }
        }
    });
    return _fileTree;
}


// get all module
// @content {String} file's content
// @currentPath {String} current file's path
// @return {Array} all module path with root path
function getDependingIds(content, currentPath, _pathToId) {
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


