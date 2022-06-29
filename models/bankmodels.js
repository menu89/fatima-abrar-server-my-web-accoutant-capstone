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

function findOneBank (id, bankid) {
    return new Promise((resolve, reject) => {
        knex('opening_bank_balances')
        .where({user_id:id,id:bankid})
        .then( (bankInfo) => {
            if (bankInfo.length === 0) {
                reject ({
                    status:400,
                    message:"The specified account does not exist for the user mentioned"
                })
            }
            resolve(bankInfo)
        })
        .catch((err) => {
            reject ({
                status:400,
                message:"We ran into difficulties searching for account info"
            })
        })
    })
}

function searchActualTransactions (id, bankName) {
    return new Promise((resolve, reject) => {
        knex('actual_transactions')
        .where({user_id:id})
        .andWhere(function(){
            this.orWhere({Debit: bankName})
                .orWhere({Credit: bankName})
        })
        .then(response => {
            if (response.length === 0) {
                resolve({
                    status:200,
                    message:"No matches found"
                })
            }
            reject({
                status:400,
                message:"This account is currently in use, or has been used in the past, and cannot be deleted."
            })
        })
        .catch(err => {
            console.log(err)
            reject({
                status:400,
                message:"We ran into difficulties searching for the requested information."
            })
        })
    })
}

function searchBudgetEntries (id, bankName) {
    return new Promise((resolve, reject) => {
        knex('budget_entries')
        .where({user_id:id})
        .andWhere(function(){
            this.orWhere({Debit: bankName})
                .orWhere({Credit: bankName})
        })
        .then(response => {
            if (response.length === 0) {
                resolve({
                    status:200,
                    message:"No matches found"
                })
            }
            reject({
                status:400,
                message:"This account is currently in use, or has been used in the past, and cannot be deleted."
            })
        })
        .catch(err => {
            console.log(err)
            reject({
                status:400,
                message:"We ran into difficulties searching for the requested information."
            })
        })
    })
}

function deleteSingleBank(id, bankid) {
    return new Promise((resolve, reject) => {
        knex('opening_bank_balances')
        .where({user_id:id, id:bankid})
        .del()
        .then((info) =>{
            if (info === 0) {
                return reject({
                    status:400,
                    message:'No Records Found'
                })
            }
            return resolve({
                status:200,
                message:`${info} record deleted`
            })
        })
        .catch((err) => { 
            return reject ({
                status:400,
                message:'Unknown Server Error'
            })
        })
    })
}

module.exports = {
    addBankAcc,
    findBankList,
    findOneBank,
    searchActualTransactions,
    searchBudgetEntries,
    deleteSingleBank
}