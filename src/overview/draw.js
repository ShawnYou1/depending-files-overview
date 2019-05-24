// draw.js is a script that draw the file relation,
// the diagram has two column and the middle is relation,
// the right column is the left's direction, the line represent they have relation,
// the middle line thickness indicates that both files have a high relation or low relation,
// sub file show relation when expand a folder
(function(global, doc){

// the depending file relation data
console.log(global.data);
let cloneTreeData = JSON.parse(JSON.stringify(global.data));
let mapTree = {};

// basic most common variable
let dependingTreeDom = document.querySelector('.depending_tree');
let currentTreeDom = document.querySelector('.current_tree');
let mapLinesDom = document.querySelector('.lines');

main();

// the program main method
function main() {

    // handle tree data
    treeDataInit(cloneTreeData, mapTree);

    console.log(cloneTreeData);
}


// handle tree data
// @cloneTreeData {Object} the variable cloneTreeData
// @mapTree {Object} the variable mapTree
function treeDataInit(cloneTreeData, mapTree) {

    if (!cloneTreeData) {
        throw new Error('cloneTreeData is undefined');
    }

    loopData(cloneTreeData, (node, parentNode) => {
        // id map to node to quickly access
        mapTree[node.id] = node;

        // parent attribute refers to parent node
        // build a double linked
        node.parent = parentNode;
    });
}

// loop every node by recursion
// @treeData {Object} it is a tree
// @callback {Function} a callback function
function loopData(treeData, callback ) {

    if (!treeData) {
        return ;
    }

    if (Array.isArray(treeData.leaves)) {
        treeData.leaves.forEach((child) => {
            callback && callback(child, treeData);
            if (child.leaves) {
                loopData(child, callback);
            }
        });
    } else {
        // default parent node's null
        callback && callback(treeData, null);
    }
}

})(window, document);
