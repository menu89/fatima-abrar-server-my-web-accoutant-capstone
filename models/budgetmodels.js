const knex = require('knex')(require('../knexfile'));

//this function adds a specific budget record to the 'budget_entries' table
function addNewBudgetTran(tranInfo) {
    return new Promise ((resolve, reject) => {
        knex('budget_entries')
        .insert(tranInfo)
        .then(() => {
            return resolve({
                status:201,
                message:"Transaction Successfully Added"
            })
        })
        .catch(err => {
            return reject({
                status:400,
                message:"Failed to add the required record."
            })
        })
    })
}

//this function searches for the most recent record added for a user and returns it.
function findLastBudgetTran(id) {
    return new Promise((resolve, reject) =>{
        knex('budget_entries')
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

//this function searches for a specific budget record by id for a given user.
function findSingleBudgetTran(dataReceipt) {
    const {tranid, id} = dataReceipt

    return new Promise((resolve, reject) => {
        knex('budget_entries')
        .where({user_id:id,id:tranid})
        .then(info => {
            if (info.length === 0) {
                return reject ({
                    status:400,
                    message:"No Records Found"
                })
            }

            return resolve({
                status:200,
                message:info
            })
        })
        .catch(err => {
            return reject ({
                status:400,
                message:"Failed to find the requested records."
            })
        })
    })
}

//this function searches for a specific record and deletes it.
function deleteSingleBudgetTran(dataReceipt) {
    const {tranid, id} = dataReceipt

    return new Promise((resolve, reject) => {
        knex('budget_entries')
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

//this function searches fpr a specific record and updates given criterion.
function updateSingleBudgetTran (tranId, id, updateCriterion) {
    return new Promise((resolve, reject) => {
        knex('budget_entries')
        .where({user_id:id, id:tranId})
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

//this function searches for all records for a user and returns them.
function findAllBudgetRecords(id) {
    return new Promise ((resolve, reject) => {
        knex('budget_entries')
        .where({user_id:id})
        .then((info) => {
            if (info.length === 0) {
                return reject({
                    status:400,
                    message:"No Records Found."
                })
            }

            resolve(info)
        })
        .catch(err => {
            return reject({
                status:400,
                message:"Failed to find the requested records."
            })
        })
    })
}

//this function searches for records for a given user for a specified period.
function findBudgetRecordsByPeriod(searchParameters) {
    const {id, startDate, nextMonth} = searchParameters

    return new Promise((resolve, reject) => {
        knex('budget_entries')
        .where(function(){
            this.where('user_id',id)
                .andWhere('Transaction_timestamp', '>=', startDate)
                .andWhere('Transaction_timestamp', '<', nextMonth)
        })
        .then((info) => {
            if (info.length === 0) {
                return reject({
                    status:400,
                    message:"No Records Found."
                })
            }
            return resolve({
                status:200,
                message:info
            })
        })
        .catch(err => {
            return reject({
                status:400,
                message:"Failed to find the requested records."
            })
        })
    })
}

//this function sums up the 'amount' column for debit fields for each distinct heading.
function findDebitByPeriodForBudgets(searchParameters) {
    const {id, startDate, nextMonth} = searchParameters

    return new Promise((resolve, reject) => {
        knex('budget_entries')
        .sum('amount')
        .groupBy('Debit')
        .select('Debit')
        .where(function(){
            this.where('user_id', id)
                .andWhere('Transaction_timestamp', '>=', startDate)
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

//this function sums up the 'amount' column for credit fields for each distinct heading.
function findCreditByPeriodForBudgets(searchParameters) {
    const {id, startDate, nextMonth} = searchParameters

    return new Promise((resolve, reject) => {
        knex('budget_entries')
        .sum('amount')
        .groupBy('Credit')
        .select('Credit')
        .where(function(){
            this.where('user_id', id)
                .andWhere('Transaction_timestamp', '>=', startDate)
                .andWhere('Transaction_timestamp', '<', nextMonth)
        })
        .then((info) => {
            if (info.length === 0) {
                return reject ({
                    status:400,
                    message:'No Records Found.'
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

module.exports = {
    addNewBudgetTran,
    findLastBudgetTran,
    findSingleBudgetTran,
    deleteSingleBudgetTran,
    updateSingleBudgetTran,
    findAllBudgetRecords,
    findBudgetRecordsByPeriod,
    findDebitByPeriodForBudgets,
    findCreditByPeriodForBudgets
}