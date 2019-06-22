/**
 * buildFilePathTree.js
 * build a file path tree by recursion
 *
 * */
'use strict';

const fs = require('fs');

// Node Class
let Node = require('./Class/node');

// utils function
let utils = require('./utils');


/**
 * buildFilePathTree method
 * recursive to travel the tree and build a path tree
 * @rootFolder {String} root folder name
 * @rootPath {String} root path
 * @fileTree {Filetree} a Filetree instance
 * @return {Filetree} a Filetree instance
 * */
function buildFilePathTree(rootFolder, rootPath, fileTree) {
    return recursiveFolder(rootFolder, rootPath, fileTree);
}

/**
 * recursiveFolder method
 * recursive to travel folder tree
 * @_folder {String} root folder name
 * @aPath {String} a path like /folder1/subFolder2  /folder1/file1.js
 * @_fileTree {Filetree} a Filetree instance
 * @return {Filetree} a Filetree instance
 * */
function recursiveFolder(_folder, aPath, _fileTree) {

    let node = new Node(utils.uniqueId(), _folder, aPath);
    _fileTree.addNode(node);

    let folderTotalDir = `${aPath}/${_folder}`

    // convenient to convert
    _fileTree.pathToId[node.id] = folderTotalDir;
    _fileTree.pathToId[folderTotalDir] = node.id;

    let stats, newPath;
    let dirList = fs.readdirSync(folderTotalDir);
    dirList.forEach((name) => {
        newPath = `${folderTotalDir}/${name}`;
        stats = fs.statSync(newPath);
        if (stats.isDirectory()) {
            recursiveFolder(name, folderTotalDir, _fileTree);
        } else {
            if (/\.(js|ts)$/.test(name)) {
                let node = new Node(utils.uniqueId(), name, folderTotalDir);

                // let file node leaves equels null
                node.leaves = null;
                _fileTree.addNode(node);
                // convenient to convert
                _fileTree.pathToId[node.id] = folderTotalDir + '/' + name;
                _fileTree.pathToId[folderTotalDir + '/' + name] = node.id;
            }
        }
    });
    return _fileTree;
}

module.exports = buildFilePathTree;
