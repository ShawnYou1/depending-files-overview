const fs = require('fs');

// use react as the debug
// https://github.com/facebook/react/tree/master/packages
const testPath = './react-master/packages/';


main();

function main() {
  recursivePath(testPath);
}

/*
 * recursion a path
 * @aPath {String} a path like /folder1/subFolder2  /folder1/file1.js
 *
 * */
function recursivePath(aPath) {
  let dirList = fs.readdirSync(aPath);

  let stats, newPath;
  dirList.forEach((name) => {
    newPath = `${aPath}${name}`;
    stats = fs.lstatSync(newPath);
    if (stats.isDirectory()) {
      console.log(`folder:${newPath}`);
      recursivePath(`${newPath}/`); 
    } else {
      // file todo 
      console.log(`file:${newPath}`);
    }
  });
}
