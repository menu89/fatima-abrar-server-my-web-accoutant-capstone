const fs = require('fs');
const { userInfo } = require('os');
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
        .catch((err) => { 
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json("A user is already registered with this email")    
            }

            return res.status(400).json("Registration Failed")
        })
}

function findUser(req,res,next) {
    const {email, password} = req.body
    knex('users_list')
        // .select('id', 'username','password')
        .where({email: email})
        .then( (userInfo) => {
            if (userInfo.length === 0) {
                return res.status(400).send("There is no user registered with this email")
            }
            req.foundUser = userInfo[0]
            next();
        })
        .catch((err) => {
            res.status(400).send("Log In failed")
        })
}

function validateCredentials (req, res, next) {
    const {id, email} = req.user
    knex('users_list')
        .where({email: email})
        .then((userInfo) => {
            if (userInfo.length === 0) {
                return res.status(400).send("There is no user registered with this email")
            }
            if (id !== userInfo[0].id) {
                return res.status(400).send('Invalid token')
            }
            next()
        })
        .catch((err) => {
            res.status(400).send("Something wrong went with your request.")
        })
}

function addBankAcc (req,res) {
    knex('opening_bank_balances')
    .insert(req.newAcc)
    .then(() => { 
        return res.status(201).json("Account added Successfully")
    })
    .catch((err) => { 
        return res.status(400).json("Failed to add the requested record.")
    })
}

module.exports = {
    readFiles,
    writeFiles,
    addNewUser,
    findUser,
    validateCredentials,
    addBankAcc
}