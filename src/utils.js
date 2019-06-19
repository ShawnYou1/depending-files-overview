/**
 * utils.js
 * some utils method
 *
 * fixPath method
 * parse method
 * uniqueId method
 *
 * */

'use strict';

const fs = require('fs');
const config = require('./config');

/**
 * fixPath method to fix relative path to absolute path
 * @relativePath {String} like 'a/b/c' or './a/b/c'
 * @currentPath {String} current file path with root path
 * @return {String} with completely path
 * */
function fixPath(relativePath, currentPath) {
  let rt = relativePath;

  // prefix like ./
  if (config.RELATIVE_PATH_PREFIX_REG.test(relativePath)) {
    rt = currentPath + relativePath.replace(config.RELATIVE_PATH_PREFIX_REG, '');

  }

  // prefix like ../xxx, ../../xxx
  if(/^(\.\.\/)(\1)*/.test(relativePath)) {
    let dotsAndSlashArr = relativePath.match(/^(\.\.\/)(\1)*/g);

    // 3 is the length of ../
    let appearTimes = dotsAndSlashArr[0].length / 3;

    let suffixReg = new RegExp('(\\w+\\/){0,'+ appearTimes +'}$', 'g');
    let removedSuffix = currentPath.replace(suffixReg, '');
    let removedPrefix = relativePath.replace(/^(\.\.\/)(\1)*/g,'');
    rt = removedSuffix + removedPrefix;

  }

  // prefix like xxx
  if (/^[^\.]/.test(relativePath)) {
    rt = config.CUSTOMER_ROOT_PATH + relativePath;
  }

  // fix shorthand module  add index.js
  if (fs.existsSync(rt + '.js')) {
    rt += '.js';
  } else if (fs.existsSync(rt + '/index.js')) {
    rt += '/index.js';
  } else {
    // it's a node module if
    rt += '-node_nodule.js';
  }

  return rt;
}


/**
 * parse method
 * get a module from a string lineCode
 * @lineCode {String} like 'import a from "./folder/file1"'
 * @return {String} the file module path
 * */
function parse(lineCode) {
  // console.log(lineCode);
  let matches = lineCode.match(/(['"])(.+)\1/);
  if (matches && Array.isArray(matches) && matches.length >= 3) {
    return matches[2];
  } else {
    return '';
  }
}

/**
 * uniqueId method
 * generate unique id
 * @return {String}
 * */
function uniqueId() {
    return Math.random().toString(36).replace('0.', '_');
}

module.exports = {
    fixPath: fixPath,

    parse: parse,

    uniqueId: uniqueId,
};
