const express = require('express');
const router = express.Router();
const knex = require('knex')(require('./knexfile'));

// to convert the knex queries into SQL info to see what might be causing issues
const querySting = (req, res) => {
    const id = 1
    //const startDate = Date.parse('5/1/2022')
    //const nextMonth = Date.parse('6/1/2022')
    const searchDate = Date.parse('6/1/2022')
    const bankName = 'TD Bank'
    let query = knex('actual_transactions')
    .where(function(){
        this.where('user_id',id)
            .andWhere('Transaction_timestamp', '<=',searchDate)
            .andWhere(function(){
                this.orWhere('Debit', `${bankName}`)
                    .orWhere('Credit', `${bankName}`)
            })
    })
    .orderBy('Transaction_timestamp','desc')
    .limit(5)
    

    let returnMsg = query.toString()
    console.log(returnMsg)
    return res.status(200).json(returnMsg)
}

router.get('/',
    querySting
)

module.exports = router;

// sample that works
// const querySting = (req, res) => {
//     const id = 1
//     const startDate = Date.parse('5/1/2022')
//     const nextMonth = Date.parse('6/1/2022')
//     let query = knex('actual_transactions')
//     .sum('amount')
//     .groupBy('Debit')
//     .select('Debit')
//     .where(function(){
//         this.where('user_id', id)
//             .andWhere('Transaction_timestamp', '>=',startDate)
//             .andWhere('Transaction_timestamp', '<', nextMonth)
//     })
    

//     let returnMsg = query.toString()
//     console.log(returnMsg)
//     return res.status(200).json(returnMsg)
// }