// draw.js is a script that draw the file relation,
// the diagram has two column and the middle is relation,
// the right column is the left's direction, the line represent they have relation,
// the middle line thickness indicates that both files have a high relation or low relation,
// sub file show relation when expand a folder
(function(global, doc){

// the depending file relation data
console.log(global.data);

// depending tree
let cloneTreeData = JSON.parse(JSON.stringify(global.data));
let mapTree = {};
let showDependingNode = {};

// current tree
let cloneTreeDataCurrent = JSON.parse(JSON.stringify(global.data));
let mapTreeCurrent = {};
let showCurrentNode = {};

// basic most common variable
let dependingTreeDom = doc.querySelector('.depending_tree');
let currentTreeDom = doc.querySelector('.current_tree');
let mapLinesDom = doc.querySelector('.lines');

let svgCanvas = null;

main();

// the program main method
function main() {

    // handle tree data for depending
    let dependingTreeData = treeDataInit(cloneTreeData, mapTree, 'depend');
    // render depending folder and file tree
    renderTree(dependingTreeDom, dependingTreeData);

    // handle tree data for current
    let currentTreeData = treeDataInit(cloneTreeDataCurrent, mapTreeCurrent, 'current');
    // render current folder and file tree
    renderTree(currentTreeDom, currentTreeData);

    refreshDiagram();

    // bind click to expand and refresh diagram
    bindEvent();
}

// update diagram when the data changed
function refreshDiagram() {
    // calculate depending weight and draw diagram
    let showDependingNode = getShowingId(cloneTreeData);
    let showCurrentNode = getShowingId(cloneTreeDataCurrent);
    calDepsWeight(showDependingNode, showCurrentNode);
    drawLines(showDependingNode, showCurrentNode);
}

// event bind
// click folder that was folded expanding it.
function bindEvent(){
    let domDepending = doc.querySelector('.depending_tree');
    let domCurrent = doc.querySelector('.current_tree');

    domDepending.addEventListener('click', clickCallback, false);
    domCurrent.addEventListener('click', clickCallback, false);

}

// click event callback
// @eve {Event} the click event object
function clickCallback(eve) {
    let target = eve.target;
    let uldom = target.querySelector('ul');
    if (target.tagName.toUpperCase() === 'LI' && uldom) {
        let id = uldom.getAttribute('data-id');
        let dtype = uldom.getAttribute('data-dtype');
        let newClassName = '';
        if (uldom.className === 'fold') {
            newClassName = 'expand';
        } else {
            newClassName = 'fold';
        }
        uldom.className = newClassName;

        let treeData;
        if (dtype === 'depend') {
            treeData = cloneTreeData;
        } else {
            treeData = cloneTreeDataCurrent
        }
        loopData(treeData, (childNode) => {
            if (childNode.id === id) {
                childNode.className = newClassName;
            }
        });
        refreshDiagram();

    }
}

// filter showing node id
// @treeData {Object} that the data tree
// @return {Object} that will showing node's id
function getShowingId(treeData) {
    let showIds = {};
    loopData(treeData, (item) => {
        // if a foler expanded will do not drawline
        if (item.className === 'fold' && item.parent.className === 'expand') {
            showIds[item.id]  = {};
        }
        if (/\.(js|ts)$/.test(item.fName) && item.parent.className === 'expand') {
            showIds[item.id]  = {};
        }
    });
    return showIds;
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
// @node {Object} one node
// @callack {Function} a callback function
function recursiveParent(node, callback) {
    callback && callback(node);

    if (node && node.parent) {
        recursiveParent(node.parent, callback);
    }
}


// render current file and folder tree
// @rootDom {DOM Object}
// @treeDom {Object} the data nodes tree
function renderTree(rootDom, treeData) {
    let ulDom = doc.createElement('ul');
    ulDom.className = treeData.className;
    let treeDom = recursiveDomTree(treeData, ulDom);
    rootDom.appendChild(treeDom);
}

// render current file and folder tree by recursion
// @treeData {Object} the data nodes tree
// @dom {DOM Object}
// @return {DOM Object}
function recursiveDomTree(treeData, dom){

    if (!treeData) {
        return ;
    }
    treeData.leaves.forEach((node) => {
        let childDom = appendElement(dom, 'li', {});
        childDom.setAttribute('data-id', node.id);
        childDom.setAttribute('data-dtype', node.dtype);
        childDom.innerHTML = `<img src="./images/file.png" />${node.fName}`;
        if (Array.isArray(node.leaves) && node.leaves.length > 0) {
            childDom.innerHTML = `<img src="./images/folder.png" />${node.fName}`;
            let ulDom = appendElement(childDom, 'ul', {'margin-left': '20px'});
            ulDom.className = node.className || '';
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
function drawLines(showDependingNode, showCurrentNode){
    let domWraper = document.querySelector('.wraper');
    let height = domWraper.clientHeight

    if (!svgCanvas) {
        svgCanvas = SVG('drawing').size(currentTreeDom.clientWidth, height);
    } else {
        svgCanvas.clear()
        svgCanvas.size(currentTreeDom.clientWidth, height);
    }
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
            svgCanvas.polyline([[0, startPosition.y], [endPosition.x, endPosition.y]])
            .stroke({ width:  bolderStroke})
        });
    });

}

// handle tree data
// @treeData {Object} the variable cloneTreeData or cloneTreeDataCurrent
// @mapTree {Object} the variable mapTree
// @dtype {String} marke the node belong to which data (dependingTree or currentTree)
function treeDataInit(treeData, mapTree, dtype) {

    if (!treeData) {
        throw new Error('treeData is undefined');
    }
    treeData.className = 'expand';

    loopData(treeData, (node, parentNode) => {
        // id map to node to quickly access
        mapTree[node.id] = node;

        // parent attribute refers to parent node
        // build a double linked
        node.parent = parentNode;

        node.dtype = dtype;

        // the level 0 default expand
        if (Array.isArray(node.leaves) && node.leaves.length >= 0) {
            node.className = 'fold';
        }
    }, 0);
    return treeData;
}

// loop every node by recursion
// @treeData {Object} it is a tree
// @callback {Function} a callback function
// @level {Number} the node's level of the treeData
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
