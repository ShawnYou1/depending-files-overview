/**
 * buildDependingTree.js
 * build depending Filetree
 *
 * */

'use strict';

const fs = require('fs');

// some config resource
const config = require('./config');

// utils function
let utils = require('./utils');

/**
 * buildDependingTree method
 * loop _fileTree to build build depending tree
 * @_fileTree {Filetree} a path tree
 * @return {Filetree}
 * */
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




/**
 * getDependingIds method
 * get tree's node id by parse code
 * @content {String} code content
 * @currentPath {String} current path
 * @_pathToId {Map} a map
 * @return {Array} depending node's id
 * */
function getDependingIds(content, currentPath, _pathToId) {
  let rt = [];
  let modulesPath = getDependingLines(content);

  if (Array.isArray(modulesPath)) {
    rt = modulesPath.map((str) => {
      let modulePath = utils.parse(str);
      let fixedPath = utils.fixPath(modulePath, currentPath);
      return _pathToId[fixedPath];
    });
  }

  return rt;
}

/**
 * getDependingLines
 * @content {String} a string that will be matched
 * @return {Array}
 * */
function getDependingLines(content) {
    return matchedByES6(content).concat(matchedByCommonJS(content));
}

/**
 * matchedByES6
 * @content {String}
 * @return {Array}
 * */
function matchedByES6(content) {
    return getMatchedLines(content, config.MODULE_ES6_PATH_REG);
}

/**
 * matchedByCommonJS
 * @content {String}
 * @return {Array}
 * */
function matchedByCommonJS(content) {
    return getMatchedLines(content, config.MODULE_COMMONJS_PATH_REG);
}

/**
 * getMatched by reg
 * @content {String}
 * @reg {RegExp}
 * @return {Array} the default is empty array
 * */
function getMatchedLines(content, reg) {
    let drt = [];
    let matched = content.match(reg)
    if (Array.isArray(matched)) {
        drt = matched;
    }
    return  drt;
}

module.exports = buildDependingTree;
