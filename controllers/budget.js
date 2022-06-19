const {findBankAcc} = require('../models/transactionsmodels');

const {addNewBudgetTran, findLastBudgetTran, findSingleBudgetTran, deleteSingleBudgetTran, updateSingleBudgetTran, findAllBudgetRecords, findBudgetRecordsByPeriod} = require('../models/budgetmodels');

const {organizeTranInfo, arrangePeriodSearchInfo, arrangeTotalByPeriod, organizeUpdateTranInfo} = require('../utilfuncs/organizeInfo')
const {confirmTransactionFields, confirmTranPeriodFields, confirmUpdateTranFields} = require('../utilfuncs/confirmFields');


function postBudgetTransaction (req, res) {
    const dataReceipt = {...req.body, ...req.user}
    const returnMsg = confirmTransactionFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }

    const postData = organizeTranInfo(dataReceipt)

    if (!!dataReceipt.mandatory) {
        if ((dataReceipt.mandatory === "y") || (dataReceipt.mandatory === "Y")) {
            postData.mandatory = true
        }
    }
    
    findBankAcc(dataReceipt)
    .then(response => {
        return addNewBudgetTran(postData)
    })
    .then(response => {
        return findLastBudgetTran(dataReceipt.id)
    })
    .then(lastTran => {
        return res.status(200).json(lastTran.response)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

function getSingleBudgetTran (req, res) {
    const dataReceipt = { ...req.user, ...req.query}
    if(!dataReceipt.tranid) {
        return res.status(400).json("Please provide the transaction id.")
    }

    findSingleBudgetTran(dataReceipt)
    .then(response => {
        return res.status(response.status).json(response.message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

function deleteSingleBudgetTranansation(req, res) {
    const dataReceipt = {...req.query,...req.user}
    if (!dataReceipt.tranid) {
        return res.status(400).json("Please provide the transaction id")
    }

    deleteSingleBudgetTran(dataReceipt)
    .then(response => {
        return res.status(response.status).json(response.message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

function patchSingleBudgetTransaction (req, res) {
    const dataReceipt = {...req.user, ...req.body}
    const returnMsg = confirmUpdateTranFields(dataReceipt)

    if (returnMsg.code === 400) {
        if (returnMsg.message === "Please provide at least one field that you are looking to update.") {
            if (!dataReceipt.mandatory) {
                return res.status(returnMsg.code).json(returnMsg.message)
            } else if (!!dataReceipt.mandatory && !'nNyY'.includes(dataReceipt.mandatory)) {
                return res.status(400).json("Please check the format of the field.")
            }
        } else {
            return res.status(returnMsg.code).json(returnMsg.message)
        }
    }

    const updateCriterion = organizeUpdateTranInfo(dataReceipt)

    const {tranid, id} = dataReceipt
    const {debit, credit, bank_type} = updateCriterion

    if (!!dataReceipt.mandatory) {
        if ((dataReceipt.mandatory === "y") || (dataReceipt.mandatory === "Y")) {
            updateCriterion.mandatory = true
        } else if ((dataReceipt.mandatory === "n") || (dataReceipt.mandatory === "N")) {
            updateCriterion.mandatory = false
        }
    }

    if((bank_type === "c" && !!credit) || (bank_type === "d" && !!debit)) {
        findBankAcc(dataReceipt)
        .then( response => {
            return findSingleBudgetTran(dataReceipt)
        })
        .then(response => {
            if (dataReceipt.bank_type !== response.message[0]['Bank_type']) {
                return res.status(400).json("This API does not support switching the bank_type. Please delete the transaction in question and create a new one.")
            }

            return updateSingleBudgetTran(tranid, id, updateCriterion)
        })
        .then( response => {
            return findSingleBudgetTran(dataReceipt)
        })
        .then(response => {
            return res.status(response.status).json(response.message)
            })
        .catch(error=>{
            return res.status(error.status).json(error.message)
        })
    } else if (!!bank_type) {
        findSingleBudgetTran(dataReceipt)
        .then(response => {
            if (dataReceipt.bank_type !== response.message[0]['Bank_type']) {
                return res.status(400).json("This API does not support switching the bank_type. Please delete the transaction in question and create a new one.")
            }

            return updateSingleBudgetTran(tranid, id, updateCriterion)
        })
        .then( response => {
            return findSingleBudgetTran(dataReceipt)
        })
        .then(response => {
            return res.status(response.status).json(response.message)
            })
        .catch(error=>{
            return res.status(error.status).json(error.message)
        })
    } else {
        updateSingleBudgetTran(tranid, id, updateCriterion)
        .then( response => {
            return findSingleBudgetTran(dataReceipt)
        })
        .then(response => {
            return res.status(response.status).json(response.message)
            })
        .catch(error=>{
            return res.status(error.status).json(error.message)
        })
    }

}

function getAllBudgetRecords (req,res) {
    const{id} = req.user
    findAllBudgetRecords(id)
    .then(tranData => {
        return res.status(200).json(tranData)
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

function getBudgetRecordsByPeriod(req, res) {
    const dataReceipt = {...req.query, ...req.user}
    const returnMsg = confirmTranPeriodFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }
    
    const result = arrangePeriodSearchInfo(dataReceipt)

    findBudgetRecordsByPeriod(result)
    .then( response => {
        return res.status(response.status).json(response.message)
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

module.exports = {
    postBudgetTransaction,
    getSingleBudgetTran,
    deleteSingleBudgetTranansation,
    patchSingleBudgetTransaction,
    getAllBudgetRecords,
    getBudgetRecordsByPeriod
}