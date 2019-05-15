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
let modulePathReg = /(export|import).+from\s+(['"])([\w\/\.\-\_]+)\2([^;])?/g;


main();

function main() {
  let filesPath = recursivePath(rootPath);

  let relations = filesPath.map((item, index) => {
    if (index === debugPos || true) {
      let totalPath = `${item.path}/${item.fileName}`;
      let content = fs.readFileSync(totalPath, 'utf8');
      item.from = getAllModule(content, item.path);
    }
    return item;
  });
  console.log(relations);
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
      console.log('fixed', fixedPath);
      return fixedPath;
    });
  }

  return rt;
}

// get a module from a line code
// @lineCode {String} like 'import a from "./folder/file1"'
// @return {String} the file module path
function parse(lineCode) {
  console.log(lineCode);
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
  relativePathPrefixReg.index = 0;
  if (relativePathPrefixReg.test(relativePath)) {
    rt = currentPath + relativePath.replace(relativePathPrefixReg, '');
  } else {
    rt = customerRootPath + relativePath;
  }

  // fix index.js
  if (!fs.existsSync(rt +'.js')) {
    rt += '/index.js';
  } else {
    rt += '.js';
  }

  return rt;
}
