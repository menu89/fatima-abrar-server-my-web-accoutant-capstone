const knex = require('knex')(require('../knexfile'));

//this function takes the debit and credit parameters and checks to see if bank accounts for them exist in the table related bank info.
function findBankAccounts(dataReceipt) {
    const {id, debit, credit} = dataReceipt
    return new Promise((resolve, reject) => {
        knex('opening_bank_balances')
        .where(function(){
            this.where('user_id',id)
                .whereIn('acc_des',[debit,credit])
        })
        .then(bankInfo => {
            if (bankInfo.length < 2) {
                return reject({
                    status:400,
                    message:'One or both of the accounts specified do not exist for the given user.'
                })
            }

            return resolve({status:200})
        })
        .catch(err => {
            return reject({
                status:400,
                message:"We ran into difficulties searching for the account info."
            })
        })
    })
}

//this function takes the information for the transfer and posts it to the table.
function addNewTransfer(transferInfo) {
    return new Promise((resolve, reject) => {
        knex('transfers')
        .insert(transferInfo)
        .then(() => {
            return resolve({
                status:201,
                message:"Transfer successfully Added."
            })
        })
        .catch(() => {
            return reject({
                status:400,
                message:"Failed to add the requested record."
            })
        })
    })
}

//this function takes a user id and searches for the last transfer posted by the user.
function findLastTransfer(id) {
    return new Promise((resolve, reject) => {
        knex('transfers')
        .where({user_id:id})
        .orderBy('id','desc')
        .first()
        .then(response => {
            return resolve({response})
        })
        .catch( () => {
            return reject({
                status:400,
                message:'Failed to find the record.'
            })
        })
    })
}

//this function searches for a single transaction in the transfers table.
function findSingleTransfer(dataReceipt) {
    const {tranid, id} = dataReceipt

    return new Promise((resolve, reject) => {
        knex('transfers')
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

//this function searches for a single transfer in the transfers table. 
function deleteSingleTransferRecord(dataReceipt){
    const {tranid, id} = dataReceipt

    return new Promise ((resolve,reject) =>{
        knex('transfers')
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

//this function updates the transfer record in the transfers table for a given user.
function updateSingleTransfer(tranId, id, updateCriterion) {
    return new Promise((resolve, reject) => {
        knex('transfers')
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

//this function searches for a single bank account
function findSingleBankAccount(dataReceipt) {
    const {id, debit, credit} = dataReceipt

    let searchAcc = ""

    if (!!debit) { searchAcc = debit}
    if (!!credit) { searchAcc = credit}
    
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

//this function searches for all transfers in the transfers table for a given user.
function findAllTransfers(id) {
    return new Promise((resolve, reject) => {
        knex('transfers')
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

//this function searches for transfers for a given user for a specified period.
function findTransfersByPeriod(searchParameters) {
    const {id, startDate, nextMonth} = searchParameters

    return new Promise ((resolve, reject) => {
        knex('transfers')
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

module.exports = {
    findBankAccounts,
    addNewTransfer,
    findLastTransfer,
    findSingleTransfer,
    deleteSingleTransferRecord,
    updateSingleTransfer,
    findSingleBankAccount,
    findAllTransfers,
    findTransfersByPeriod
}