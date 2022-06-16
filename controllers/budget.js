const {findBankAcc} = require('../models/transactionsmodels');

const {addNewBudgetTran, findLastBudgetTran, findSingleBudgetTran} = require('../models/budgetmodels');

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

module.exports = {
    postBudgetTransaction,
    getSingleBudgetTran
}