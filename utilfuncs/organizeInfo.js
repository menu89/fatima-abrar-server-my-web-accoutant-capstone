const fs = require('fs');
const accList = './data/accTypes.json';

function getLists () {
    const accountListData = JSON.parse(fs.readFileSync(accList))
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
    return {expList, incList}
}

//supplementary function to organize data for posting transactions
function organizeTranInfo (dataReceipt) {
    const {id, amount, debit, credit, transaction_timestamp, description, bank_type} = dataReceipt

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
        bank_type:bank_type,
        transaction_timestamp: tranTS,
        Record_timestamp: currentTime,
        user_id: id
    }
    
    return transactionInfo
}

//supplementary function for repeating code in findTranPeriod and getPeriodTotal
function arrangePeriodSearchInfo(dataReceipt) {
    const {month, year, id} = dataReceipt
    const nextM = parseInt(month)+1

    const startDate = Date.parse(`${month}/1/${year}`)
    const nextMonth = Date.parse(`${nextM}/1/${year}`)
    
    const searchParameters = {
        id: id,
        startDate: startDate,
        nextMonth: nextMonth
    }

    return searchParameters
}

//supplementary function for getPeriodTotal
function arrangeTotalByPeriod (debitInfo,creditInfo,dataReceipt,searchPara) {
    
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
        email: dataReceipt.email,
        period: new Date(searchPara.startDate).toString(),
        enquiry: 'actual'
    }

    const {expList, incList} = getLists()

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

    return ({
        status:200,
        message:responseObj
    })
}

//supplementary function for patchSingleTransaction
function organizeUpdateTranInfo (dataReceipt) {
    const {id, amount, debit, credit, bank_type, transaction_timestamp, accDesc, tranid} = dataReceipt
    const updateObject = {}

    if (!!debit || !!credit) {
        updateObject.bank_type = bank_type

        if (!!debit) {
            updateObject.debit = debit
        }

        if (!!credit) {
            updateObject.credit = credit
        }
    }

    if (!!accDesc) {
        updateObject.description = accDesc
    }

    if (!!amount) {
        updateObject.amount = parseInt(amount)
    }

    if (!!transaction_timestamp) {
        if (!parseInt(transaction_timestamp)) {
            updateObject.transaction_timestamp = Date.parse(transaction_timestamp)
        } else if (transaction_timestamp.includes('-')) {
            updateObject.transaction_timestamp = Date.parse(new Date(transaction_timestamp))
        } else {
            updateObject.transaction_timestamp = parseInt(transaction_timestamp)
        }
    }

    return updateObject
}


//supplementary function to organize data for posting tranfers
function organizeTranferInfo (dataReceipt) {
    const {id, amount, debit, credit, transaction_timestamp, description} = dataReceipt

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

    const transferInfo = {
        amount: amountInt,
        Debit: debit,
        Credit: credit,
        Description: tranDes,
        transaction_timestamp: tranTS,
        Record_timestamp: currentTime,
        user_id: id
    }
    
    return transferInfo
}

//supplementary function for patchSingleTransfer
function organizeUpdateTransferInfo (dataReceipt) {
    const {amount, debit, credit, transaction_timestamp, accDesc} = dataReceipt
    const updateObject = {}

    if (!!debit) {
        updateObject.debit = debit
    }

    if (!!credit) {
        updateObject.credit = credit
    }

    if (!!accDesc) {
        updateObject.description = accDesc
    }

    if (!!amount) {
        updateObject.amount = parseInt(amount)
    }

    if (!!transaction_timestamp) {
        if (!parseInt(transaction_timestamp)) {
            updateObject.transaction_timestamp = Date.parse(transaction_timestamp)
        } else if (transaction_timestamp.includes('-')) {
            updateObject.transaction_timestamp = Date.parse(new Date(transaction_timestamp))
        } else {
            updateObject.transaction_timestamp = parseInt(transaction_timestamp)
        }
    }

    return updateObject
}

module.exports = {
    organizeTranInfo,
    arrangePeriodSearchInfo,
    arrangeTotalByPeriod,
    organizeTranInfo,
    organizeUpdateTranInfo,
    organizeTranferInfo,
    organizeUpdateTransferInfo
}