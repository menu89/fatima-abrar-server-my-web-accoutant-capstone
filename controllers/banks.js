const {addBankAcc, findBankList} = require('../models/bankmodels');

const { confirmBankingFields } = require('../utilfuncs/confirmFields');

const addBankInfo = (req, res) => {
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

const findBanks = (req,res) => {
    const {id} = req.user

    findBankList(id)
    .then(userInfo => {
        res.status(200).json(userInfo)
    })
    .catch(err =>{
        res.status(err.status).json(err.message)
    })
}

module.exports = {
    addBankInfo,
    findBanks
}