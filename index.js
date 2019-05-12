const fs = require('fs');

// use react as the debug
// https://github.com/facebook/react/tree/master/packages
const rootPath = './react-master/packages/';

// console a log when loop a array
const debugPos = 10; // 0, 10

// if thereis a import path 'folder1/file1'
// the completely path is rootPath + 'folder1/file1'
const customerRootPath = rootPath;

// match a file content
let modulePathReg = /(export|import).+from\s+([\w\/\.\-\_"']+)([^;])?/g;


main();

function main() {
  let filesPath = recursivePath(rootPath);

  let relations = filesPath.map((item, index) => {
    if (index === debugPos) {
      let totalPath = `${item.path}/${item.fileName}`;
      let content = fs.readFileSync(totalPath, 'utf8');
      item.from = getAllModule(content, item.path);
    }
    return item;
  });
  console.log(relations[debugPos]);
}

// recursion a path
// @aPath {String} a path like /folder1/subFolder2  /folder1/file1.js
function recursivePath(aPath, filesPath = []) {
  let dirList = fs.readdirSync(aPath);

  let stats, newPath;
  dirList.forEach((name) => {
    newPath = `${aPath}${name}`;
    stats = fs.lstatSync(newPath);
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
function getAllModule(content, currentPath) {
  let rt = [];
  let modulesPath = content.match(modulePathReg);

  if (Array.isArray(modulesPath)) {
    console.log(modulesPath);
    let rt = modulesPath.forEach((str) => {
      let modulePath = parse(str);
      console.log(11, modulePath);
      // TODO
      //
      return currentPath; 
    });
  }

  return rt;
}

// get a module from a line code
function parse(lineCode) {
  console.log(lineCode);
  let matches = lineCode.match(/(['"])(.+)\1/);
  if (matches && Array.isArray(matches)) {
    return matches[2];
  } else {
    return ''; 
  }
}
