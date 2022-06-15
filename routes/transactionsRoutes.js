const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postTransaction, getTranPeriod, getPeriodTotal, getSingleTransaction, deleteSingleTransaction, getAllTransactions, putSingleTransaction} = require('../controllers/transactions')

router
    .post('/transaction-single', 
        decodeJWT, 
        validateCredentials, 
        postTransaction
    )
    .get('/transactions-by-period',
        decodeJWT,
        validateCredentials,
        getTranPeriod
    )
    .get('/total-by-period',
        decodeJWT,
        validateCredentials,
        getPeriodTotal
    )
    .get('/transactions-all',
        decodeJWT,
        validateCredentials,
        getAllTransactions
    )
    .get('/transaction-single',
        decodeJWT,
        validateCredentials,
        getSingleTransaction
    )
    .put('/transaction-single',
        decodeJWT,
        validateCredentials,
        putSingleTransaction
    )
    .delete('/transaction-single',
        decodeJWT,
        validateCredentials,
        deleteSingleTransaction
    )
    


module.exports = router;