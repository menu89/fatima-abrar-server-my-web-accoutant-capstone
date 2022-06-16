const { findBankAcc, addNewTran, findTranByPeriod, findDebitByPeriod, findCreditByPeriod, deleteSingleTran, findSingleTran, findAllTransactions, updateSingleTran,findLastTransaction} = require('../models/transactionsmodels')

const {organizeTranInfo, arrangePeriodSearchInfo, arrangeTotalByPeriod, organizeUpdateTranInfo} = require('../utilfuncs/organizeInfo')
const {confirmTransactionFields, confirmTranPeriodFields, confirmUpdateTranFields} = require('../utilfuncs/confirmFields');
//const { response } = require('express');

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

function putSingleTransaction (req,res) {
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
    putSingleTransaction,
    deleteSingleTransaction
}