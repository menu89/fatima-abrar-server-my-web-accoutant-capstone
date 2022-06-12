const knex = require('knex')(require('../knexfile'));

function addNewUser(userInfo) {

    return new Promise((resolve,reject) => {
        knex('users_list')
        .insert(userInfo)
        .then(() => { 
            resolve ({
                status:201,
                message:"Registration Successfull"
            })
        })
        .catch((err) => { 
            if (err.code === 'ER_DUP_ENTRY') {
                reject({
                    status:400,
                    "message":"A user is already registered with this email"
                })
            }
            reject ({
                status:400,
                message:"Registration Failed"
            })
        })
    })
}

function findUser(email) {
    
    return new Promise((resolve, reject)=>{
        knex('users_list')
        // .select('id', 'username','password')
        .where({email: email})
        .then( (userInfo) => {
            if (userInfo.length === 0) {
                reject ({
                    status:400,
                    message:"There is no user registered with this email"
                })
            }
            resolve(userInfo[0])
        })
        .catch((err) => {
            reject({
                status:400,
                message:"Log in failed"
            })
        })
    })
}

function findBankList (id) {
    return new Promise((resolve, reject) => {
        knex('opening_bank_balances')
        .where({user_id:id})
        .then( (userInfo) => {
            if (userInfo.length === 0) {
                reject ({
                    status:400,
                    message:"The specified account does not exist for the user mentioned"
                })
            }
            resolve(userInfo)
        })
        .catch((err) => {
            reject ({
                status:400,
                message:"We ran into difficulties searching for account info"
            })
        })
    })
}

function addBankAcc (newAcc) {
    return new Promise ((resolve, reject) =>{
        knex('opening_bank_balances')
        .insert(newAcc)
        .then(() => { 
            resolve({
                status:201,
                message:"Account added Successfully"
            })
        })
        .catch((err) => { 
            reject({
                status:400,
                message:"Failed to add the requested record."
            })
        })
    })
}

module.exports = {
    addNewUser,
    findUser,
    addBankAcc,
    findBankList
}