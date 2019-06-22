/**
 * This project's main file
 *
 * */

'use strict';

// some config resource
const config = require('./config');

// Filetree Class
let Filetree = require('./Class/fileTree');

// buildFilePathTree function
let buildFilePathTree = require('./buildFilePathTree');

// buildFilePathTree function
let buildDependingTree = require('./buildDependingTree');

// buildFilePathTree function
let cleanBuildFileTree = require('./cleanBuildFileTree');

// store function
let store = require('./store');


function main() {

    // build file path tree
    let fileTree = buildFilePathTree(config.ROOT_FOLDER, config.ROOT_PATH, new Filetree());

    // build depending tree
    let depengingTree = buildDependingTree(fileTree);

    // clean the fileTree
    let cleaningDependingTree = cleanBuildFileTree(fileTree);

    // write data to ./overview/data.js
    store(cleaningDependingTree.rootNode, config.DATA_PATH);
}

main();
