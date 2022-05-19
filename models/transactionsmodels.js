const knex = require('knex')(require('../knexfile'));

function addNewTran (req,res) {
    knex('actual_transactions')
    .insert(req.transaction)
    .then(() => { 
        return res.status(201).json("Transaction Successfully Added")
    })
    .catch((err) => { 
        return res.status(400).json("Failed to add the requested record.")
    })
}

function findTranByPeriod (req, res) {
    const {id, startDate, nextMonth} = req.searchPara
    knex('actual_transactions')
    .where(function(){
        this.where('user_id', id)
            .andWhere('Transaction_timestamp', '>=',startDate)
            .andWhere('Transaction_timestamp', '<', nextMonth)
    })
    .then((info) => {
        if (info.length === 0) {
            return res.status(400).send('No records found.')
        }
        return res.status(200).json(info)
    })
    .catch((err) => { 
        return res.status(400).json("Failed to find the requested records.")
    })
}

module.exports = {
    addNewTran,
    findTranByPeriod
}