const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {checkTransactions, addTransactions, checkTranPeriod, sendTotalByPeriod} = require('../controllers/transactions')
const { findBankAcc, addNewTran, findTranByPeriod, findDebitByPeriod, findCreditByPeriod} = require('../models/transactionsmodels')

router
    .post('/transaction', 
        decodeJWT, 
        validateCredentials, 
        checkTransactions, 
        findBankAcc, 
        addTransactions,
        addNewTran
    )
    //get
    .get('/transaction-by-period',
        decodeJWT,
        validateCredentials,
        checkTranPeriod,
        findTranByPeriod
    )
    //get
    .get('/total-by-period',
        decodeJWT,
        validateCredentials,
        checkTranPeriod,
        findDebitByPeriod,
        findCreditByPeriod,
        sendTotalByPeriod
    )


module.exports = router;