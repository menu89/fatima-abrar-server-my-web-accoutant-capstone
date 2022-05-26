const fs = require('fs');
const accList = './data/accTypes.json';

function readAccountList() {
    const readList = fs.readFileSync(accList)
    return readList
}


module.exports = {
    readAccountList
}