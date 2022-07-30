const fs = require('fs');
const accList = './data/accTypes.json';

//this function reads the data in the accTypes.json file and returns it.
function readAccountList() {
    const readList = fs.readFileSync(accList)
    return readList
}


module.exports = {
    readAccountList
}

/** temporary functions to test end points */
// const tempdata = './tempdata/tempdata.json';
// function readFiles() {
//     const usefile = fs.readFileSync(tempdata);
//     const temp = JSON.parse(usefile);
//     return temp;
// }
// function writeFiles(Obj) {
//     fs.writeFileSync(tempdata,JSON.stringify(Obj,null,3))
//     return "file updated"
// }
//temporary functions to test endpoints end here