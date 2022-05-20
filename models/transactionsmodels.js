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

function findDebitByPeriod (req,res, next) {
    const {id, startDate, nextMonth} = req.searchPara
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
            return res.status(400).send('No records found.')
        }
        req.debitInfo = [...info]
        next()
    })
    .catch((err) => { 
        return res.status(400).json("Failed to find the requested records.")
    })
}

function findCreditByPeriod (req,res,next) {
    const {id, startDate, nextMonth} = req.searchPara
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
            return res.status(400).send('No records found.')
        }
        req.creditInfo = [...info]
        next()
    })
    .catch((err) => { 
        return res.status(400).json("Failed to find the requested records.")
    })
}

module.exports = {
    addNewTran,
    findTranByPeriod,
    findDebitByPeriod,
    findCreditByPeriod
}