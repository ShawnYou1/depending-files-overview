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
const MODULE_PATH_REG = /(export|import).+from\s+(['"])([\w\/\.\-\_]+)\2([^;])?/g;

module.exports = {
    ROOT_FOLDER: ROOT_FOLDER,

    ROOT_PATH: ROOT_PATH,

    CUSTOMER_ROOT_PATH: CUSTOMER_ROOT_PATH,

    RELATIVE_PATH_PREFIX_REG: RELATIVE_PATH_PREFIX_REG,

    MODULE_PATH_REG: MODULE_PATH_REG,
};
