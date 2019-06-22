/**
 * node.js
 * define Node class
 *
 * */

'use strict';

/**
 * Node class
 * @id {String} unique id to sign a node instance
 * @fName {String} folder or file name, so it named fName
 * @filePath {String} file's path
 *
 * */
function Node(id, fName, filePath) {

    // basic info
    this.id = id;
    this.fName = fName;
    this.filePath = filePath;

    // store sub node
    this.leaves = [];

    // store depend modules
    this.deps = [];
}

module.exports = Node;
