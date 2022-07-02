const knex = require('knex')(require('../knexfile'));

//this function searches for the bank account to see if it exists for the given user.
function findBankAcc(dataReceipt) {
    const {id,debit,credit,bank_type} = dataReceipt
        
    let searchAcc = ""
    if (bank_type === "c") { searchAcc = credit}
    if (bank_type === "d") { searchAcc = debit}

    return new Promise((resolve, reject) => {
        knex('opening_bank_balances')
        .where({user_id:id, acc_des: searchAcc})
        .then( (userInfo) => {
            if (userInfo.length === 0) {
                return reject({
                    status:400,
                    message:'The specified account does not exist for the user mentioned'
                })
            }

            return resolve({status:200});
        })
        .catch((err) => {
            return reject({
                status:400,
                message:'We ran into difficulties searching for account info'
            })
        })
    })
    
}

//this function adds a new transaction to the actuals table for a given user
function addNewTran (transactionInfo) {
    return new Promise((resolve,reject) => {
        knex('actual_transactions')
        .insert(transactionInfo)
        .then(() => { 
            return resolve({
                status:201,
                message:'Transaction Successfully Added'
            })
        })
        .catch((err) => { 
            return reject({
                status:400,
                message:'Failed to add the requested record.'
            })
        })
    })
}

//this function searches for transactions for a given user for a specified period.
function findTranByPeriod (searchParameters) {
    const {id, startDate, nextMonth} = searchParameters

    return new Promise ((resolve, reject) => {
        knex('actual_transactions')
        .where(function(){
            this.where('user_id', id)
                .andWhere('Transaction_timestamp', '>=',startDate)
                .andWhere('Transaction_timestamp', '<', nextMonth)
        })
        .then((info) => {
            if (info.length === 0) {
                return reject({
                    status:400,
                    message:'No Records Found.'
                })
            }
            return resolve({
                status:200,
                message:info
            })
        })
        .catch((err) => { 
            return reject({
                status:400,
                message:'Failed to find the requested records.'
            })
        })
    })
}

//this function totals the 'amount' column for each distinct heading under 'Debit' for a given user.
function findDebitByPeriod (searchParameters) {
    const {id, startDate, nextMonth} = searchParameters

    return new Promise((resolve, reject) => {
        knex('actual_transactions')
        .sum('amount')
        .groupBy('Debit')
        .select('Debit')
        .where(function(){
            this.where('user_id', id)
                .andWhere('Transaction_timestamp', '>=',startDate)
                .andWhere('Transaction_timestamp', '<', nextMonth)
        })
        .then((info) => {
            if (info.length === 0) {
                return reject ({
                    status:400,
                    message:'No Records Found.'
                })
            }
            return resolve({debitInfo:info})
        })
        .catch((err) => { 
            return reject({
                status:400,
                message:'Failed to find the requested records.'
            })
        })
    })
}

//this function totals the 'amount' column for each distinct heading under 'Credit' for a given user.
function findCreditByPeriod (searchParameters) {
    const {id, startDate, nextMonth} = searchParameters

    return new Promise((resolve, reject) => {
        knex('actual_transactions')
        .sum('amount')
        .groupBy('Credit')
        .select('Credit')
        .where(function(){
            this.where('user_id', id)
                .andWhere('Transaction_timestamp', '>=',startDate)
                .andWhere('Transaction_timestamp', '<', nextMonth)
        })
        .then((info) => {
            if (info.length === 0) {
                return reject({
                    status:400,
                    message:'No records found.'
                })
            }
            return resolve({creditInfo:info})
        })
        .catch((err) => { 
            return reject({
                status:400,
                message:'Failed to find the requested records.'
            })
        })
    })
}

//this function searches for all transactions in the actuals table for a given user.
function findAllTransactions (id) {
    return new Promise((resolve, reject) => {
        knex('actual_transactions')
        .where({user_id:id})
        .then((info) =>{
            if (info.length === 0) {
                return reject({
                    status:400,
                    message:'No Records Found'
                })
            }
            resolve(info)
        })
        .catch((err) => { 
            return reject({
                status:400,
                message:"Failed to find the requested records."
            })
        })
    })
}

//this function searches for a single transaction in the actuals table for a given user for the specified transaction id.
function findSingleTran (dataReceipt) {
    const {tranid, id} = dataReceipt

    return new Promise((resolve,reject) => {
        knex('actual_transactions')
        .where({user_id:id, id:tranid})
        .then((info) => {
            if (info.length === 0) {
                return reject({
                    status:400,
                    message:'No Records Found'
                })
            }

            return resolve({
                status:200,
                message:info
            })
        })
        .catch((err) => { 
            return reject({
                status:400,
                message:"Failed to find the requested records."
            })
        })
    })
}

//thsi function updates the transaction in the actuals table for a given user.
function updateSingleTran (tranId, id, updateCriterion) {
    return new Promise((resolve, reject) => {
        knex('actual_transactions')
        .where({user_id:id, id: tranId})
        .update(updateCriterion)
        .then( response => {
            resolve(response)
        })
        .catch(err => {
            return reject({
                status:400,
                message:"Failed to update the requested record."
            })
        })
    })
}

//this function searches for the last transaction posted for a given user and returns it.
function findLastTransaction (id) {
    return new Promise((resolve, reject) =>{
        knex('actual_transactions')
        .where({user_id:id})
        .orderBy('id', 'desc')
        .first()
        .then(response => {
            return resolve({response})
        })
        .catch(err => {
            return reject({
                status:400,
                message:"Failed to update the requested record."
            })
        })
    })
}

//this function deletes a single transaction for a given user.
function deleteSingleTran (dataReceipt) {
    const{tranid, id} = dataReceipt

    return new Promise ((resolve,reject) =>{
        knex('actual_transactions')
        .where({user_id:id, id:tranid})
        .del()
        .then((info) => {
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
    findBankAcc,
    addNewTran,
    findTranByPeriod,
    findDebitByPeriod,
    findCreditByPeriod,
    findAllTransactions,
    findSingleTran,
    updateSingleTran,
    findLastTransaction,
    deleteSingleTran
}