const fs = require('fs');
const accList = './data/accTypes.json';

const { findBankAcc, addNewTran, findTranByPeriod, findDebitByPeriod, findCreditByPeriod, deleteSingleTran, findSingleTran} = require('../models/transactionsmodels')
const {confirmTransactionFields, confirmTranPeriodFields} = require('../utilfuncs/confirmFields');

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

function postTransaction (req, res) {
    const dataReceipt = {...req.body, ...req.user}
    const returnMsg = confirmTransactionFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }

    findBankAcc(dataReceipt)
    .then(response => {
        return addNewTran(organizeTranInfo(dataReceipt))
    })
    .then(response => {
        return res.status(response.status).json(response.message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
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

function findTranPeriod (req,res) {
    const dataReceipt = {...req.query, ...req.user}
    const returnMsg = confirmTranPeriodFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }
    
    const result = arrangePeriodSearchInfo(dataReceipt)

    findTranByPeriod(result)
    .then(response => {
        return res.status(response.status).json(response.message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
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

function getPeriodTotal(req, res) {
    const dataReceipt = {...req.query, ...req.user}
    const returnMsg = confirmTranPeriodFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }
    
    const result = arrangePeriodSearchInfo(dataReceipt)
    
    let debitInfo = []
    let creditInfo = []

    
    findDebitByPeriod(result)
    .then(response =>{
        debitInfo =[...response.debitInfo]
        return findCreditByPeriod(result)
    })
    .then(response => {
        creditInfo = [...response.creditInfo]
        const searchPara = {...result}
        const {status,message} = arrangeTotalByPeriod(debitInfo,creditInfo,dataReceipt, searchPara)
        return res.status(status).json(message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

function getSingleTransaction (req,res) {
    const dataReceipt = {...req.query, ...req.user}
    if (!dataReceipt.tranid) {
        return res.status(400).json('Please provide the transaction  id')
    }

    findSingleTran(dataReceipt)
    .then(response => {
        return res.status(response.status).json(response.message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

function deleteSingleTransaction (req,res) {
    const dataReceipt = {...req.query, ...req.user}
    if (!dataReceipt.tranid) {
        return res.status(400).json('Please provide the transaction  id')
    }

    deleteSingleTran(dataReceipt)
    .then(response => {
        return res.status(response.status).json(response.message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

module.exports = {
    postTransaction,
    findTranPeriod,
    getPeriodTotal,
    getSingleTransaction,
    deleteSingleTransaction
}