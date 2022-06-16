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

module.exports = {
    addNewBudgetTran,
    findLastBudgetTran
}