// use react as the debug
// https://github.com/facebook/react/tree/master/packages
const ROOT_FOLDER = 'packages';
const ROOT_PATH = './react-master';

// if thereis a import path 'folder1/file1'
// the completely path is ROOT_PATH + 'folder1/file1'
// ofen config it by likeing webpack
const CUSTOMER_ROOT_PATH = ROOT_PATH + '/' + ROOT_FOLDER + '/';

const RELATIVE_PATH_PREFIX_REG = /^\.\//;

// a regex that match a line module
const MODULE_ES6_PATH_REG = /(export|import).+from\s+(['"])([\w\/\.\-]+)\2([^;])?/g;
const MODULE_COMMONJS_PATH_REG = /(require)\((['"])([\w\/\.\-]+)\2\)([^;])?/g;

// depending relation data file path
const DATA_PATH = './overview/data.js';

module.exports = {
    ROOT_FOLDER: ROOT_FOLDER,

    ROOT_PATH: ROOT_PATH,

    CUSTOMER_ROOT_PATH: CUSTOMER_ROOT_PATH,

    RELATIVE_PATH_PREFIX_REG: RELATIVE_PATH_PREFIX_REG,

    MODULE_ES6_PATH_REG: MODULE_ES6_PATH_REG,

    MODULE_COMMONJS_PATH_REG: MODULE_COMMONJS_PATH_REG,

    DATA_PATH: DATA_PATH,
};
