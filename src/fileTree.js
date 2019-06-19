/**
 * fileTree.js
 * define Filetree class
 *
 * recursive method
 * addNode method
 * loop method
 *
 * */

'use strict';

/**
 * file tree class
 *
 * */
function Filetree() {
    this.rootNode = null;

    // a map container to convert path to id or id to path
    // a map table {id: path, path: id}
    this.pathToId = {};
}

/**
 * addNode method
 * add a node into the file tree by path
 * @newNode {Node} node instance
 *
 * */
Filetree.prototype.addNode = function(newNode){
    let eachFilePath;
    if (!this.rootNode) {
        this.rootNode = newNode;
    } else {
        this.loop((eachNode, index) => {
            eachFilePath = `${eachNode.filePath}/${eachNode.fName}`;
            // if newNode's path equals one's path of the tree
            if (eachFilePath === newNode.filePath) {
                eachNode.leaves.push(newNode);
            }
        });
    }
}

/**
 * loop method to travel the file tree
 * @callback {Function} travel each node as the callback's parameter
 *
 * */
Filetree.prototype.loop = function(callback){
    if (this.rootNode) {
        Filetree.recursive(this.rootNode, callback);
    }
}

/**
 * recursive static method  to travle every node
 * @node {Node} a node
 * @callback {Function} travel each node as the callback's parameter
 *
 * */
Filetree.recursive = function(node, callback){
    callback(node);
    if (node.leaves && node.leaves.length > 0) {
        node.leaves.forEach((leaf) => {
            Filetree.recursive(leaf, callback);
        });
    }
}

module.exports = Filetree;
