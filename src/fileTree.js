// File Tree class
function Filetree() {
    this.rootNode = null;

    // convert path to id or id to path
    // a map table {id: path, path: id}
    this.pathToId = {};
}

// add a node into the file tree by path
// @node {Node}
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

// loop the file tree
// @callback {Function} a callback function
Filetree.prototype.loop = function(callback){
    if (this.rootNode) {
        Filetree.recursive(this.rootNode, callback);
    }
}

// Filetree class static method recursive
// @node {Node} a node
// @callback {Function} a callback function
Filetree.recursive = function(node, callback){
    callback(node);
    if (node.leaves && node.leaves.length > 0) {
        node.leaves.forEach((leaf) => {
            Filetree.recursive(leaf, callback);
        });
    }
}

module.exports = Filetree;
