const {addBankAcc, findBankList, findOneBank, searchActualTransactions,searchBudgetEntries, deleteSingleBank, getBankActivityByDate, searchTopFiveActualTransactions, getBankTransferTotalsByDate, searchTopFiveTransfers, searchTopFiveBudgetRecords} = require('../models/bankmodels');

const { confirmBankingFields, confirmBankTranByDate } = require('../utilfuncs/confirmFields');

//this function takes the parameters for creating a bank/payment account. checks them for accurancy, then organizes them, then interacts with the database to add the bank account..
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

//this function takes the user id and returns a list af all bank accounts that exist under it.
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

//this endpoint thats a user id and the bank record id and checks to see if it is being used anywhere. if it isn't being used anywhere, then it deletes the specific record.
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

//gets a breakdown of debits and credits up-to a the specified date from the actuals table. geta a breakdown of transfers up-to a specified date from the transfers table. It also returns the most recent transaction and transfer activity.
const getTransactionsByDate = (req, res) => {
    const {id} = req.user
    const {bankid, balance_timestamp} = req.query

    const validationData = {...req.query}

    const returnMsg = confirmBankTranByDate(validationData)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }
    
    let searchDate = 0
    if (!parseInt(balance_timestamp)) {
        searchDate = Date.parse(balance_timestamp)
    } else {
        searchDate = parseInt(balance_timestamp)
    }

    let bankName = ''
    let responseData = {}
    findOneBank(id,bankid)
    .then((bankInfo) => {
        bankName = bankInfo[0]['acc_des']
        responseData = {...bankInfo[0]}
        return getBankActivityByDate(id,bankName,searchDate)
    })
    .then((response) => {
        responseData.money_paid = response.message[0][0]['CreditTotal']
        responseData.money_received = response.message[0][0]['DebitTotal']
        return getBankTransferTotalsByDate(id,bankName,searchDate)
        
    })
    .then(response => {
        responseData.transfer_in = response.message[0][0]['TransferIn']
        responseData.transfer_out = response.message[0][0]['TransferOut']
        return searchTopFiveActualTransactions(id,bankName, searchDate)
    })
    .then((response) => {
        if (response.message === "No matches found") {
            responseData.recent_five_actuals = []
        } else {
            responseData.recent_five_actuals = [...response.message]
        }
        return searchTopFiveTransfers(id, bankName,searchDate)
    })
    .then((response) => {
        if (response.message === "No matches found") {
            responseData.recent_five_transfers = []
        } else {
            responseData.recent_five_transfers = [...response.message]
        }
        return searchTopFiveBudgetRecords(id,bankName,searchDate)
    }).then((response) => {
        if (response.message === "No matches found") {
            responseData.recent_five_budget_records = []
        } else {
            responseData.recent_five_budget_records = [...response.message]
        }
        return res.status(response.status).json(responseData)
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

module.exports = {
    postBankInfo,
    getBankList,
    deleteBankAccount,
    getTransactionsByDate
}