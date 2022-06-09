const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {checkTransactions, addTransactions, checkTranPeriod, sendTotalByPeriod,checkSingleTranParams} = require('../controllers/transactions')
const { findBankAcc, addNewTran, findTranByPeriod, findDebitByPeriod, findCreditByPeriod, findSingleTran} = require('../models/transactionsmodels')

router
    .post('/transaction', 
        decodeJWT, 
        validateCredentials, 
        checkTransactions, 
        findBankAcc, 
        addTransactions,
        addNewTran
    )
    .get('/transaction-by-period',
        decodeJWT,
        validateCredentials,
        checkTranPeriod,
        findTranByPeriod
    )
    .get('/total-by-period',
        decodeJWT,
        validateCredentials,
        checkTranPeriod,
        findDebitByPeriod,
        findCreditByPeriod,
        sendTotalByPeriod
    )
    .get('/single-transaction',
        decodeJWT,
        validateCredentials,
        checkSingleTranParams,
        findSingleTran
    )
    


module.exports = router;