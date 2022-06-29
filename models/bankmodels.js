const knex = require('knex')(require('../knexfile'));

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
    addBankAcc,
    findBankList
}