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
let showDependingNode = {};
let showCurrentNode = {};

// basic most common variable
let dependingTreeDom = doc.querySelector('.depending_tree');
let currentTreeDom = doc.querySelector('.current_tree');
let mapLinesDom = doc.querySelector('.lines');

main();

// the program main method
function main() {

    // handle tree data
    treeDataInit(cloneTreeData, mapTree);

    // render depending folder and file tree
    renderTree(dependingTreeDom);

    // render current folder and file tree
    renderTree(currentTreeDom);
    console.log(cloneTreeData);

    // calculate depending weight
    calDepsWeight(showDependingNode, showCurrentNode);

    drawLines(showDependingNode, showCurrentNode);
}

// calculate weight based on currently showing node
// @dependNodes {Map} id -> {}
// @currentNodes {Map} id ->  {}
function calDepsWeight(dependNodes, currentNodes) {
    let dependNodeIds = Object.keys(dependNodes);
    let currentNodeIds = Object.keys(currentNodes);

    dependNodeIds.forEach((id) => {
        // first of all ,solve the first folder
        let firstNode = mapTree[id];

        // map to current node and give a weight
        dependNodes[id] = {};
        loopData(firstNode, (childNode) => {
            if (Array.isArray(childNode.deps)) {
                childNode.deps.forEach((subId) => {
                    // find current node id and  add weight
                    let referringToCurrentNodeId = findMapId(mapTree[subId],  currentNodeIds);
                    if (referringToCurrentNodeId) {
                        if (!dependNodes[id][referringToCurrentNodeId]) {
                            dependNodes[id][referringToCurrentNodeId] = 1;
                        } else {
                            dependNodes[id][referringToCurrentNodeId] += 1;
                        }
                    }
                })
            }
        });
    });
}

// find map id
// @dependingNode {String}
// @showCurrentNode {Array} all currently showing node ids
function findMapId(depNode, showCurrentIds) {
    let id;
    recursiveParent(depNode, (parentNode) => {
        if ( parentNode && showCurrentIds.includes(parentNode.id)) {
            id = parentNode.id;
        }
    });
    return id;
}

// recursion parent
function recursiveParent(node, callback) {
    callback && callback(node);

    if (node && node.parent) {
        recursiveParent(node.parent, callback);
    }
}


// render current file and folder tree
function renderTree(rootDom) {
    let ulDom = doc.createElement('ul');
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
        if (node.level === 0) {
            showDependingNode[node.id] = {};
            showCurrentNode[node.id] = {};
        }

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
    let element = doc.createElement(ele);

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
function drawLines(showDependingNode){

    let  draw = SVG('drawing').size(currentTreeDom.clientWidth, currentTreeDom.clientHeight);
    Object.keys(showDependingNode).forEach((id)=>{
        let oneNode = showDependingNode[id];

        let depDom = document.querySelector('.depending_tree  [data-id="'+ id +'"]');
        let startPosition = {
            x: 0,
            y: depDom.offsetTop + 15 - 10,
        };

        Object.keys(oneNode).forEach((refId, index) => {
            let bolderStroke = Math.sqrt(oneNode[refId]);
            let dom = document.querySelector('.current_tree [data-id="'+ refId +'"]');
            let endPosition = {
                x: currentTreeDom.clientWidth,
                y: dom.offsetTop + 15 - 10,
            }
            console.log(mapTree[refId], dom, endPosition);
            draw.polyline([[0, startPosition.y], [endPosition.x, endPosition.y]])
            .stroke({ width:  bolderStroke})
        });
    });

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
    }, 0);
}

// loop every node by recursion
// @treeData {Object} it is a tree
// @callback {Function} a callback function
function loopData(treeData, callback , level) {

    if (!treeData) {
        return ;
    }

    if (Array.isArray(treeData.leaves)) {
        treeData.leaves.forEach((child) => {
            if ( Number.isFinite(level) ) {
                child.level = level;
            }
            callback && callback(child, treeData);
            if (child.leaves) {
                loopData(child, callback, level + 1);
            }
        });
    } else {
        // default parent node's null
        callback && callback(treeData, null);
    }
}

})(window, document);
