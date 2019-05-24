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

    render();
}

// render file and folder tree and svg link lines
function render(){

    // render depending folder and file tree
    renderTree(dependingTreeDom);

    // render current folder and file tree
    renderTree(currentTreeDom);

    drawLines();
}

// render current file and folder tree
function renderTree(rootDom) {
    let ulDom = document.createElement('ul');
    let treeDom = recursiveDomTree(cloneTreeData, ulDom);
    rootDom.appendChild(treeDom);
}

// render current file and folder tree
function recursiveDomTree(cloneTreeData, dom){

    if (!cloneTreeData) {
        return ;
    }
    cloneTreeData.leaves.forEach((node) => {
        let childDom = appendElement(dom, 'li', {});
        childDom.setAttribute('data-id', node.id);
        childDom.innerHTML = `<img src="./images/file.png" />${node.fName}`;

        if (Array.isArray(node.leaves) && node.leaves.length > 0) {
            childDom.innerHTML = `<img src="./images/folder.png" />${node.fName}`;
            let ulDom = appendElement(childDom, 'ul', {'margin-left': '20px', 'display': 'none'});
            return recursiveDomTree(node, ulDom);
        }
    });

    return dom;
}

// append a element
// @parentDom {DOM} parent dom
// @ele {String} the dom tagName
// @styleObj {Object} css style object
// @return {DOM} new ul dom
function appendElement (parentDom, ele, styleObj) {
    let element = document.createElement(ele);

    if (styleObj) {
        let cssText = '';
        for (let pro in styleObj) {
            cssText += `${pro}:${styleObj[pro]};`
        }
        element.style.cssText = cssText;
    }
    parentDom.appendChild(element);
    return element;
}

// draw lines to link from depending tree to current tree
function drawLines(){

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

        // the folder node's default type is closed;
        if (Array.isArray(node.leaves)) {
            node.type = 'closed';
        }
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
