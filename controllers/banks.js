const {addBankAcc, findBankList, findOneBank, searchActualTransactions,searchBudgetEntries, deleteSingleBank} = require('../models/bankmodels');

const { confirmBankingFields } = require('../utilfuncs/confirmFields');

const postBankInfo = (req, res) => {
    const {accType, accDesc, amount, balance_timestamp} = req.body
    const returnMsg = confirmBankingFields(accType, accDesc, amount, balance_timestamp)
    
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }

    const convertNo = parseInt(amount)
    let balTS = 0

    if (!parseInt(balance_timestamp)) {
        balTS = Date.parse(balance_timestamp)
    } else {
        balTS = parseInt(balance_timestamp)
    }

    const newAcc = {
        acc_type: accType,
        acc_des: accDesc,
        amount: convertNo,
        balance_timestamp:balTS,
        user_id: req.user.id
    };

    addBankAcc(newAcc)
    .then( response => {
        res.status(response.status).json(response.message)
    })
    .catch(err => {
        res.status(err.status).json(err.message)
    })
}

const getBankList = (req,res) => {
    const {id} = req.user

    findBankList(id)
    .then(userInfo => {
        res.status(200).json(userInfo)
    })
    .catch(err =>{
        res.status(err.status).json(err.message)
    })
}

const deleteBankAccount = (req, res) => {
    const {id} = req.user
    const {bankid} = req.query

    if (!bankid) {
        return res.status(400).json("Please specify the bank to be deleted.")
    }

    let bankName =''
    findOneBank(id,bankid)
    .then((bankInfo) => {
        bankName = bankInfo[0][`acc_des`]
        return searchActualTransactions(id,bankName)
    })
    .then((tranInfo)=>{
        return searchBudgetEntries(id,bankName)
    })
    .then((budgetInfo) => {
        return deleteSingleBank(id, bankid)
    })
    .then((info) => {
        return res.status(200).json(info.message)
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

module.exports = {
    postBankInfo,
    getBankList,
    deleteBankAccount
}