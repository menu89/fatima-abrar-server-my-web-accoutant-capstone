const fs = require('fs');
const knex = require('knex')(require('../knexfile'));

/** temporary functions to test end points */
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
//temporary functions to test endpoints end here

function addNewUser(req,res) {
    knex('users_list')
        .insert(req.newUser)
        .then(() => { 
            return res.status(201).json("Registration Successfull")
        })
        .catch(() => { 
            return res.status(400).json("Registration Failed")
        })
}


module.exports = {
    readFiles,
    writeFiles,
    addNewUser
}