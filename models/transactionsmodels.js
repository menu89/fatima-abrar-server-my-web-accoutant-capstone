const knex = require('knex')(require('../knexfile'));

function findBankAcc(req,res,next) {
    const {id, email} = req.user
    const {debit, credit, bank_type} = req.body
    
    let searchAcc = ""
    if (bank_type === "c") { searchAcc = credit}
    if (bank_type === "d") { searchAcc = debit}

    knex('opening_bank_balances')
        .where({user_id:id, acc_des: searchAcc})
        .then( (userInfo) => {
            if (userInfo.length === 0) {
                return res.status(400).send("The specified account does not exist for the user mentioned")
            }

            next();
        })
        .catch((err) => {
            res.status(400).send("We ran into difficulties searching for account info")
        })
}

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
    findBankAcc,
    addNewTran,
    findTranByPeriod,
    findDebitByPeriod,
    findCreditByPeriod
}