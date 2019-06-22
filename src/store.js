/**
 * store.js
 * store depending relation data
 *
 * */

'use strict';

let writeToFile = require('./utils').writeToFile;

/**
 * store depending relation data
 * @rootNode {Filetree}
 * @storePath {String} file path
 * */
function store(rootNode, storePath) {
    let dtreeStr = JSON.stringify(rootNode);
    let codeStr = `
        (function(global){
            global.data = ${dtreeStr}
        })(window);
    `;
    writeToFile(storePath)(codeStr);
}

module.exports = store;
