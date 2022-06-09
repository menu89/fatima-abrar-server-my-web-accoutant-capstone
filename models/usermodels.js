const knex = require('knex')(require('../knexfile'));

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

function findBankList (req,res) {
    const {id, email} = req.user
    knex('opening_bank_balances')
        .where({user_id:id})
        .then( (userInfo) => {
            if (userInfo.length === 0) {
                return res.status(400).send("The specified account does not exist for the user mentioned")
            }
            res.status(200).send(userInfo)
        })
        .catch((err) => {
            res.status(400).send("We ran into difficulties searching for account info")
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
    addNewUser,
    findUser,
    addBankAcc,
    findBankList
}