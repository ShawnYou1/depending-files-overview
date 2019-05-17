const fs = require('fs');
const config = require('./config');

// conver relative path to total path
// @relativePath {String} like 'a/b/c' or './a/b/c'
// @currentPath {String} current file path with root path
// @CUSTOMER_ROOT_PATH {String} 'a/b/c'
// @return {String} with completely path
function fixPath(relativePath, currentPath) {
  let rt = relativePath;

  // prefix './'
  if (config.RELATIVE_PATH_PREFIX_REG.test(relativePath)) {
    rt = currentPath + relativePath.replace(config.RELATIVE_PATH_PREFIX_REG, '');
  } else {
    rt = config.CUSTOMER_ROOT_PATH + relativePath;
  }

  // fix shorthand module  add index.js
  if (!fs.existsSync(rt +'.js')) {
    rt += '/index.js';
  } else {
    rt += '.js';
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

// generate unique id
function uniqueId() {
    return Math.random().toString(36).replace('0.', '_');
}

module.exports = {
    fixPath: fixPath,

    parse: parse,

    uniqueId: uniqueId,
};
