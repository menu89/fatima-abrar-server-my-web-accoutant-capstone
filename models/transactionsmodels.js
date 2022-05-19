const knex = require('knex')(require('../knexfile'));

function addNewTran (req,res) {
    knex('actual_transactions')
    .insert(req.transaction)
    .then(() => { 
        return res.status(201).json("Transaction Successfully Added")
    })
    .catch((err) => { 
        console.log(err)
        return res.status(400).json("Failed to add the requested record.")
    })
}

module.exports = {
    addNewTran
}