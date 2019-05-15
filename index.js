const fs = require('fs');

// use react as the debug
// https://github.com/facebook/react/tree/master/packages
const rootPath = './react-master/packages/';

// console a log when loop a array
const debugPos = 50; // 0, 10, 11, 13

// if thereis a import path 'folder1/file1'
// the completely path is rootPath + 'folder1/file1'
const customerRootPath = rootPath;

const relativePathPrefixReg = /^\.\//;

// match a file content
const modulePathReg = /(export|import).+from\s+(['"])([\w\/\.\-\_]+)\2([^;])?/g;


main();

function main() {
  let filesPath = recursivePath(rootPath);

  let filePathRelation = filesPath.map((item, index) => {
    if (index === debugPos || true) {
      let totalPath = `${item.path}/${item.fileName}`;
      let content = fs.readFileSync(totalPath, 'utf8');
      item.from = getAllModule(content, item.path);
    }
    return item;
  });
  // console.log(filePathRelation);

  // convert filePathRelation to a tree with depending relation
  let treeDependRelation = convertPath2tree(filePathRelation);
  console.log(treeDependRelation);
}

// recursion a path
// @aPath {String} a path like /folder1/subFolder2  /folder1/file1.js
function recursivePath(aPath, filesPath = []) {
  let dirList = fs.readdirSync(aPath);

  let stats, newPath;
  dirList.forEach((name) => {
    newPath = `${aPath}${name}`;
    stats = fs.statSync(newPath);
    if (stats.isDirectory()) {
      recursivePath(`${newPath}/`, filesPath);
    } else {
      if (/\.(js|ts)$/.test(name)) {
        filesPath.push({
          fileName: name,
          path: aPath,
        });
      }
    }
  });
  return filesPath;
}


// get all module
// @content {String} file's content
// @currentPath {String} current file's path
// @return {Array} all module path with root path
function getAllModule(content, currentPath) {
  let rt = [];
  let modulesPath = content.match(modulePathReg);

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
// @customerRootPath {String} 'a/b/c'
// @return {String} with completely path
function fixPath(relativePath, currentPath) {
  let rt = relativePath;

  // prefix './'
  if (relativePathPrefixReg.test(relativePath)) {
    rt = currentPath + relativePath.replace(relativePathPrefixReg, '');
  } else {
    rt = customerRootPath + relativePath;
  }

  // fix shorthand module  add index.js
  if (!fs.existsSync(rt +'.js')) {
    rt += '/index.js';
  } else {
    rt += '.js';
  }

  return rt;
}

// @filePathRelation {Object} example:  {name : 'file.js', path: 'a/b/', from: []}
// @return {Object} like a tree
function convertPath2tree(filePathRelation) {
    let tree = {};

    // build basic tree
    filePathRelation.forEach((item, index) => {
        let filePath = `${item.path}${item.fileName}`
        let leafNode = recursiveOnePath(tree, filePath);
        item.treeNode = leafNode;
    });

    // console.log(22, JSON.stringify(tree));

    // build node depend on relation
    filePathRelation.forEach((item, index) => {
        item.treeNode['depending'] = [];
        item.from.forEach((dependPath, subIndex) => {
            let dependNode = findByPath(dependPath, tree);
            item.treeNode['depending'].push(dependNode);
        });
     });

    return tree;
}

// @root {Object} tree
// @onePathArr {String} a file path
// example:
// ./a/b/c/d.js => {a: {b: {c: {"d.js": {}}}}}
// ./a/b/c/e.js => {a: {b: {c: {"d.js": {}, "e".js:{}}}}}
function recursiveOnePath(root, filePath) {
    let onePathArr = filePath.split('/');
    let leaf = root;
    onePathArr.forEach((fName, index) => {
        if (!leaf[fName]) {
            leaf[fName] = {};
        }
        leaf = leaf[fName];
    });
    return leaf;
}

// find node by path
// @path {String} a path
// @return {Object} return the path's object
function findByPath(filePath, tree) {
    let onePathArr = filePath.split('/');

    let tempPoint = tree;
    onePathArr.forEach((fName) => {
        if (tempPoint[fName]) {
            tempPoint = tempPoint[fName];
        }
    });

    return tempPoint;
}
