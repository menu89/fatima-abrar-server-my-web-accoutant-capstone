const {findBankAcc} = require('../models/transactionsmodels');

const {addNewBudgetTran, findLastBudgetTran, findSingleBudgetTran, deleteSingleBudgetTran, updateSingleBudgetTran, findAllBudgetRecords, findBudgetRecordsByPeriod, findDebitByPeriodForBudgets, findCreditByPeriodForBudgets} = require('../models/budgetmodels');

const {organizeTranInfo, arrangePeriodSearchInfo, arrangeTotalByPeriod, organizeUpdateTranInfo} = require('../utilfuncs/organizeInfo')
const {confirmTransactionFields, confirmTranPeriodFields, confirmUpdateTranFields} = require('../utilfuncs/confirmFields');

//this function takes the paramets for one budget record and checks to see if all the fields are there and meet certain criterion. If they do, then it checks to see if the bank account used exists for the given user. if it exists, then it posts the record entry to the table. the function then seraches for the most recent record posted (i.e. the one that was just created), and returns it in the response body.
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

    const convertTimestampMonth = new Date(postData.transaction_timestamp).getMonth()+1
    const convertTimestampYear = new Date(postData.transaction_timestamp).getFullYear()
    const modifyDate = Date.parse(`${convertTimestampMonth}/1/${convertTimestampYear}`)
    postData.transaction_timestamp = modifyDate
    
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

//this function searchs for a budget records by userid and record id and returns the record if it exists.
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

//this function searches for a budget record by user id and record id and deletes the record if it is found.
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

//this function receaives edit parameters, checks to see if the parameters meet certain conditions. if it meets the conditions, then there are three possible situations.
//if a debit or credit is changed, then it checks to see if we are changing the bank account. if it is, then it checks to see if the new bank account specified exists for the given user. if it exists, it then searches for the given budget record. checks to see if bank type is being switched( this is not supported ). if the bank type is not being switched, then updates the specified record, finds the updated record and returns it as a response.
//if the bank account is not the one being changed, then it skips the step of looking for the bank account and the reaminder of the steps remain the same.
//if fields other the debit and credit are being updated, then it updates the record and returns the updated record as a response.
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

    if (!!updateCriterion.transaction_timestamp) {
        const convertTimestampMonth = new Date(updateCriterion.transaction_timestamp).getMonth()+1
        const convertTimestampYear = new Date(updateCriterion.transaction_timestamp).getFullYear()
        const modifyDate = Date.parse(`${convertTimestampMonth}/1/${convertTimestampYear}`)
        updateCriterion.transaction_timestamp = modifyDate
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

//this function searches for all budget records for a given user and returns it.
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

//this function searchs for budget records for a user fi they fall within a given period.
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

//this function provides the totals of the amount column by distinct records. It searches for debit and credit separately and nets the two to arrive and the wanted totals.
function getBudgetTotalsByPeriod(req, res) {
    const dataReceipt = {...req.query, ...req.user}
    const returnMsg = confirmTranPeriodFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }
    
    const result = arrangePeriodSearchInfo(dataReceipt)
    
    let debitInfo = []
    let creditInfo = []

    findDebitByPeriodForBudgets(result)
    .then(response =>{
        debitInfo =[...response.debitInfo]
        return findCreditByPeriodForBudgets(result)
    })
    .then(response => {
        creditInfo = [...response.creditInfo]
        const searchPara = {...result}
        const {status,message} = arrangeTotalByPeriod(debitInfo,creditInfo,dataReceipt, searchPara)
        message.enquiry = "budget"
        return res.status(status).json(message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

module.exports = {
    postBudgetTransaction,
    getSingleBudgetTran,
    deleteSingleBudgetTranansation,
    patchSingleBudgetTransaction,
    getAllBudgetRecords,
    getBudgetRecordsByPeriod,
    getBudgetTotalsByPeriod
}