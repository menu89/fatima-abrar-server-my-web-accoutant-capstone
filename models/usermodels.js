const fs = require('fs');
const knex = require('knex')(require('../knexfile'));

const tempdata = './tempdata/tempdata.json';

function readFiles() {
    const usefile = fs.readFileSync(tempdata);
    const temp = JSON.parse(usefile);
    return temp;
}
function writeFiles(Obj) {
    fs.writeFileSync(tempdata,JSON.stringify(Obj,null,3))
    return "file updated"
}

const getAll = () => {
    return readFiles();
}

module.exports = {
    readFiles,
    writeFiles
}