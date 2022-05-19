const {confirmTransactionFields, confirmTranPeriodFields} = require('../utilfuncs/confirmFields');


function checkTransactions (req, res, next) {
    const dataReceipt = {...req.body}
    const returnMsg = confirmTransactionFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }

    next()
}

function addTransactions (req, _res, next) {
    const {id, email} = req.user
    const {amount, debit, credit, bank_type, transaction_timestamp, description} = req.body

    let tranTS = 0
    let amountInt = parseInt(amount)
    const currentTime = Date.now()
    let tranDes = ""

    if (!parseInt(transaction_timestamp)) {
        tranTS = Date.parse(transaction_timestamp)
    } else {
        tranTS = parseInt(transaction_timestamp)
    }

    if (description) { tranDes = description}

    const transactionInfo = {
        amount: amountInt,
        Debit: debit,
        Credit: credit,
        Description: tranDes,
        transaction_timestamp: tranTS,
        Record_timestamp: currentTime,
        user_id: id
    }
    
    req.transaction = {...transactionInfo}

    next()
}

function checkTranPeriod (req,res,next) {
    const dataReceipt = {...req.body}
    const returnMsg = confirmTranPeriodFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }

    const {month, year} = dataReceipt
    const {id, email} = req.user
    const nextM = parseInt(month)+1

    const startDate = Date.parse(`${month}/1/${year}`)
    const nextMonth = Date.parse(`${nextM}/1/${year}`)

    const searchParameters = {
        id: id,
        startDate: startDate,
        nextMonth: nextMonth
    }

    req.searchPara = {...searchParameters}

    next()

}

module.exports = {
    checkTransactions,
    addTransactions,
    checkTranPeriod
}