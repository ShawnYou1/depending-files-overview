/**
 * cleanBuildFileTree.js
 * clean the Filetree
 *
 * */

'use strict';

/**
 * cleanBuildFileTree
 * @_fileTree {Filetree}
 * @return {Filetree}
 * */
function cleanBuildFileTree(_fileTree) {
    _fileTree.loop((node) => {
        delete node.filePath;
    });

    return _fileTree;
}

module.exports = cleanBuildFileTree;
