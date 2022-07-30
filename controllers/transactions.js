const { findBankAcc, addNewTran, findTranByPeriod, findDebitByPeriod, findCreditByPeriod, deleteSingleTran, findSingleTran, findAllTransactions, updateSingleTran,findLastTransaction} = require('../models/transactionsmodels')

const {organizeTranInfo, arrangePeriodSearchInfo, arrangeTotalByPeriod, organizeUpdateTranInfo} = require('../utilfuncs/organizeInfo')
const {confirmTransactionFields, confirmTranPeriodFields, confirmUpdateTranFields} = require('../utilfuncs/confirmFields');

//this function checks the parameters received to see if anything is missing or in the wrong format. next it checks to see if the bank account specified exists. It then posts the new transaction, then searches for the most recent posted transaction for the given user and returns it in the response body example.
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
        return findLastTransaction(dataReceipt.id)
    })
    .then(lastTran => {
        return res.status(200).json(lastTran.response)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

//this function searches for transactions for actuals for a given user for a specified period.
function getTranPeriod (req,res) {
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

//this function takes the totals of the 'amount' column for each distinct heading under 'debit' and 'credit' and then nets the two to arrive and one set of totals.
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

//this function searches for all the transactions for a given user and returns them.
function getAllTransactions (req, res) {
    const {id} = req.user

    findAllTransactions(id)
    .then(tranData => {
        return res.status(200).json(tranData)
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

//this function searches for a record for a given user by the specified transaction id.
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

//this function takes the edit parameters for an entry. checks to see if the parameters meet certain conditions. There are then three possible situations.
//if a debit or credit is changed, then it checks to see if we are changing the bank account. if it is, then it checks to see if the new bank account specified exists for the given user. if it exists, it then searches for the given budget record. checks to see if bank type is being switched( this is not supported ). if the bank type is not being switched, then updates the specified record, finds the updated record and returns it as a response.
//if the bank account is not the one being changed, then it skips the step of looking for the bank account and the reaminder of the steps remain the same.
//if fields other the debit and credit are being updated, then it updates the record and returns the updated record as a response.
function patchSingleTransaction (req,res) {
    const dataReceipt  = {...req.user, ...req.body}
    const returnMsg = confirmUpdateTranFields(dataReceipt)

    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }

    const updateCriterion = organizeUpdateTranInfo(dataReceipt)
    
    const {tranid, id} = dataReceipt
    const {debit, credit, bank_type} = updateCriterion
    
    if((bank_type === "c" && !!credit) || (bank_type === "d" && !!debit)) {
        findBankAcc(dataReceipt)
        .then(response => {
            return findSingleTran(dataReceipt)
        })
        .then(response => {
            if (dataReceipt.bank_type !== response.message[0]['Bank_type']) {
                return res.status(400).json("This API does not support switching the bank_type. Please delete the transaction in question and create a new one.")
            }
            return updateSingleTran(tranid, id, updateCriterion)
        })
        .then(response => {
            return findSingleTran(dataReceipt)
        })
        .then(response => {
            return res.status(response.status).json(response.message)
            })
        .catch(error=>{
            return res.status(error.status).json(error.message)
        })
    } else if (!!bank_type) {
        findSingleTran(dataReceipt)
        .then(response => {
            if (dataReceipt.bank_type !== response.message[0]['Bank_type']) {
                return res.status(400).json("This API does not support switching the bank_type. Please delete the transaction in question and create a new one.")
            }
            return updateSingleTran(tranid, id, updateCriterion)
        })
        .then(response => {
            return findSingleTran(dataReceipt)
        })
        .then(response => {
            return res.status(response.status).json(response.message)
            })
        .catch(error=>{
            return res.status(error.status).json(error.message)
        })
    } else {
        updateSingleTran(tranid, id, updateCriterion)
        .then(response => {
            return findSingleTran(dataReceipt)
        })
        .then(response => {
            return res.status(response.status).json(response.message)
            })
        .catch(error=>{
            return res.status(error.status).json(error.message)
        })
    }
}

//this function searches for a single transaction for a given user and deletes it.
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
    getTranPeriod,
    getPeriodTotal,
    getAllTransactions,
    getSingleTransaction,
    patchSingleTransaction,
    deleteSingleTransaction
}