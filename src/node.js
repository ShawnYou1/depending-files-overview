
// node class
// @id {String} unique id to sign a node
// @fileName {String} file's name include extra
// @filePath {String} file's path
// @type {String} the value is 'file' or 'folder'
function Node(id, fileName, filePath, type) {

    // basic info
    this.id = id;
    this.fileName = fileName;
    this.filePath = filePath;
    this.type = type;

    // lots of leaves
    this.leaves = [];

    // depend modules
    this.deps = [];
}

module.exports = Node;
