const fs = require('fs');
const knex = require('knex')(require('../knexfile'));

const tempdata = './tempdata/tempdata.json';

function readFiles() {
    const usefile = fs.readFileSync(tempdata);
    const treeData = JSON.parse(usefile);
    return treeData;
}

const getAll = () => {
    return readFiles();
}

module.exports = {
    getAll
}