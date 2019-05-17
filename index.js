const fs = require('fs');

// use react as the debug
// https://github.com/facebook/react/tree/master/packages
const ROOT_FOLDER = 'packages';
const ROOT_PATH = './react-master';

// if thereis a import path 'folder1/file1'
// the completely path is ROOT_PATH + 'folder1/file1'
// ofen config it by likeing webpack
const CUSTOMER_ROOT_PATH = ROOT_PATH + '/' + ROOT_FOLDER + '/';

const RELATIVE_PATH_PREFIX_REG = /^\.\//;

// a regex that match a line module
const MODULE_PATH_REG = /(export|import).+from\s+(['"])([\w\/\.\-\_]+)\2([^;])?/g;

// node class
// @fileName {String} file's name include extra
// @filePath {String} file's path
// @type {String} the value is 'file' or 'folder'
function Node(fileName, filePath, type) {

    // basic info
    this.fileName = fileName;
    this.filePath = filePath;
    this.type = type;

    // lots of leaves
    this.leaves = [];

    // depend modules
    this.deps = [];
}

// File Tree class
function Filetree() {
    this.rootNode = null;
}

// add a node into the file tree by path
// @node {Node}
Filetree.prototype.addNode = function(node){
    let eachFilePath;
    if (!this.rootNode) {
        this.rootNode = node;
    } else {
        this.loop((eachNode, index) => {
            eachFilePath = `${eachNode.filePath}/${eachNode.fileName}`;
            if (eachFilePath === node.filePath) {
                eachNode.leaves.push(node);
            }
        });
    }
}

// loop the file tree
// @callback {Function} a callback function
Filetree.prototype.loop = function(callback){
    if (this.rootNode) {
        Filetree.recursive(this.rootNode, callback);
    }
}

// Filetree class static method recursive
// @node {Node} a node
// @callback {Function} a callback function
Filetree.recursive = function(node, callback){
    callback(node);
    if (node.leaves && node.leaves.length > 0) {
        node.leaves.forEach((leaf) => {
            Filetree.recursive(leaf, callback);
        });
    }
}

main();

function main() {

    // init a  empty file tree
    let fileTree = new Filetree();

    // build file path tree
    recursivePath(ROOT_FOLDER, ROOT_PATH, fileTree);

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
  let modulesPath = content.match(MODULE_PATH_REG);

  if (Array.isArray(modulesPath)) {
    rt = modulesPath.map((str) => {
      let modulePath = parse(str);
      let fixedPath = fixPath(modulePath, currentPath);
      // console.log('fixed', fixedPath);
      return fixedPath;
    });
  }

  return rt;
}

// get a module from a line code
// @lineCode {String} like 'import a from "./folder/file1"'
// @return {String} the file module path
function parse(lineCode) {
  // console.log(lineCode);
  let matches = lineCode.match(/(['"])(.+)\1/);
  if (matches && Array.isArray(matches) && matches.length >= 3) {
    return matches[2];
  } else {
    return '';
  }
}

// conver relative path to total path
// @relativePath {String} like 'a/b/c' or './a/b/c'
// @currentPath {String} current file path with root path
// @CUSTOMER_ROOT_PATH {String} 'a/b/c'
// @return {String} with completely path
function fixPath(relativePath, currentPath) {
  let rt = relativePath;

  // prefix './'
  if (RELATIVE_PATH_PREFIX_REG.test(relativePath)) {
    rt = currentPath + relativePath.replace(RELATIVE_PATH_PREFIX_REG, '');
  } else {
    rt = CUSTOMER_ROOT_PATH + relativePath;
  }

  // fix shorthand module  add index.js
  if (!fs.existsSync(rt +'.js')) {
    rt += '/index.js';
  } else {
    rt += '.js';
  }

  return rt;
}
