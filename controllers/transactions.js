const {confirmTransactionFields} = require('../utilfuncs/confirmFields');


function checkTransactions (req, res, next) {
    const dataReceipt = {...req.body}
    const returnMsg = confirmTransactionFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }

    next()
}

function addTransactions (req, res, next) {
    const {id, email} = req.user
    const {amount, debit, credit, bank_type, transaction_timestamp, description} = req.body

    let tranTS = 0
    let amountInt = parseInt(amount)
    const currentTime = new Date(Date.now()).toString()
    let tranDes = ""

    if (!parseInt(transaction_timestamp)) {
        tranTS = Date.parse(transaction_timestamp).toString()
    } else {
        tranTS = new Date(parseInt(transaction_timestamp)).toString()
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

module.exports = {
    checkTransactions,
    addTransactions
}