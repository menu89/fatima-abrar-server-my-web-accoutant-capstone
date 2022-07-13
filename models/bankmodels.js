const knex = require('knex')(require('../knexfile'));

//this function looks for the bank accounts for a specific user and returns the records found.
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

//this function takes the information received and adds a bank records for a spcific user.
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

//this function looks for one specific bank records for a given user.
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

//this function checks to see if a specific account has been used in the 'actual_transactions' table. returns a positive if no records are found.
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
            reject({
                status:400,
                message:"We ran into difficulties searching for the requested information."
            })
        })
    })
}

//this function checks to see if a specific bank account has been used in the 'budget_entries' table. returns a positive if no records are found.
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
            reject({
                status:400,
                message:"We ran into difficulties searching for the requested information."
            })
        })
    })
}

//deletes the bank records from the table.
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

//this function searches through actual transactions and returns a sum of the 'amount' column separately for all instances of 'Debit' and 'Credit'
function getBankActivityByDate(id,bankName,searchDate) {

    let queryParamater = `SELECT SUM(CASE WHEN user_id=${id} THEN (CASE WHEN Transaction_timestamp < ${searchDate} THEN (CASE WHEN Credit='${bankName}' THEN -amount END) END) ELSE 0 END) AS CreditTotal, SUM((CASE WHEN user_id = ${id} THEN (CASE WHEN Transaction_timestamp < ${searchDate} THEN (CASE WHEN Debit='${bankName}' THEN amount END) END) ELSE 0 END)) AS DebitTotal FROM actual_transactions`

    return new Promise ((resolve, reject) => {
        knex.raw(queryParamater)
        .then((response) => {
            resolve({
                status:200,
                message:response
            })
        })
        .catch(err => {
            reject({
                status:400,
                message:"We ran into issues executing your request."
            })
        })
    })
}

//this function searchs through actual transactions and returns the 5 most recent transactions (by transaction date, not record date).
function searchTopFiveActualTransactions (id, bankName,searchDate) {
    return new Promise((resolve, reject) => {
        knex('actual_transactions')
        .where(function(){
            this.where('user_id',id)
                .andWhere('Transaction_timestamp', '<=',searchDate)
                .andWhere(function(){
                    this.where('Debit', `${bankName}`)
                        .orWhere('Credit', `${bankName}`)
                })
        })
        .orderBy('Transaction_timestamp','desc')
        .limit(5)
        .then(response => {
            if (response.length === 0) {
                resolve({
                    status:200,
                    message:"No matches found"
                })
            }
            resolve({
                status:200,
                message:response
            })
        })
        .catch(err => {
            reject({
                status:400,
                message:"We ran into difficulties searching for the requested information."
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
    deleteSingleBank,
    getBankActivityByDate,
    searchTopFiveActualTransactions
}