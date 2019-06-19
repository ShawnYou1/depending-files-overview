/**
 * store.js
 * store depending relation data
 *
 * */

'use strict';

const fs = require('fs');

/**
 * store depending relation data
 * @rootNode {Filetree}
 * */
function store(rootNode, storePath) {
    let dtreeStr = JSON.stringify(rootNode);
    let codeStr = `
        (function(global){
            global.data = ${dtreeStr}
        })(window);
    `
    //console.log(config.DATA_PATH);
    const fd = fs.openSync(storePath, 'w');
    fs.writeSync(fd, codeStr);
}

module.exports = store;
