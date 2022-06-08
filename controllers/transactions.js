const {confirmTransactionFields, confirmTranPeriodFields} = require('../utilfuncs/confirmFields');

const accountListData = require('../data/accTypes.json');
const expList = []
const incList = []
accountListData.forEach((acc) => {
    if ( acc.type === "expense") {
        expList.push(acc.name)
    }
    if ( acc.type === "income") {
        incList.push(acc.name)
    }
})


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
    const dataReceipt = {...req.query}
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

function sendTotalByPeriod (req, res) {
    const {debitInfo,creditInfo, searchPara,user} = req
    
    const listAccHashMap = []
    for (let loopDebit =0; loopDebit < debitInfo.length; loopDebit++) {
        if (!listAccHashMap[debitInfo[loopDebit]['Debit']]) {
            listAccHashMap[debitInfo[loopDebit]['Debit']] = 0
        }

        listAccHashMap[debitInfo[loopDebit]['Debit']] += debitInfo[loopDebit]["sum(`amount`)"]
    }

    for (let loopCredit =0; loopCredit < creditInfo.length; loopCredit++) {
        if (!listAccHashMap[creditInfo[loopCredit]['Credit']]) {
            listAccHashMap[creditInfo[loopCredit]['Credit']] = 0
        }
        
        listAccHashMap[creditInfo[loopCredit]['Credit']] -= creditInfo[loopCredit]["sum(`amount`)"]
    }

    const listAccKeys = Object.keys(listAccHashMap)
    const responseObj = {
        income:[],
        expense:[],
        email: user.email,
        period: new Date(searchPara.startDate).toString(),
        enquiry: 'actual'
    }

    for (let loopKey = 0; loopKey < listAccKeys.length; loopKey++) {
        const currKey = listAccKeys[loopKey]
        const accObj = {[currKey]: listAccHashMap[currKey]}

        if (expList.includes(currKey)) {
            responseObj.expense.push(accObj)
        }
        if (incList.includes(currKey)) {
            responseObj.income.push(accObj)
        }
    }

    res.status(200).json(responseObj)
}

module.exports = {
    checkTransactions,
    addTransactions,
    checkTranPeriod,
    sendTotalByPeriod
}