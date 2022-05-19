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

function findBankAcc(req,res,next) {
    const {id, email} = req.user
    const {debit, credit, bank_type} = req.body
    
    let searchAcc = ""
    if (bank_type === "c") { searchAcc = credit}
    if (bank_type === "d") { searchAcc = debit}

    knex('opening_bank_balances')
        .where({user_id:id, acc_des: searchAcc})
        .then( (userInfo) => {
            if (userInfo.length === 0) {
                return res.status(400).send("The specified account does not exist for the user mentioned")
            }

            next();
        })
        .catch((err) => {
            res.status(400).send("We ran into difficulties searching for account info")
        })
}

module.exports = {
    readFiles,
    writeFiles,
    addNewUser,
    findUser,
    validateCredentials,
    addBankAcc,
    findBankAcc
}