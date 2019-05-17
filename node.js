
// node class
// @fileName {String} file's name include extra
// @filePath {String} file's path
// @type {String} the value is 'file' or 'folder'
function Node(fileName, filePath, type) {

    // basic info
    this.fileName = fileName;
    this.filePath = filePath;
    this.type = type;

    // lots of leaves
    this.leaves = [];

    // depend modules
    this.deps = [];
}

module.exports = Node;
