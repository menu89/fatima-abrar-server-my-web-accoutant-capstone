const knex = require('knex')(require('../knexfile'));

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

module.exports = {
    addNewBudgetTran,
    findLastBudgetTran,
    findSingleBudgetTran,
    deleteSingleBudgetTran,
    updateSingleBudgetTran,
    findAllBudgetRecords,
    findBudgetRecordsByPeriod
}