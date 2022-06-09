const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postTransaction, findTranPeriod, getPeriodTotal, sendTotalByPeriod,getSingleTransaction, deleteSingleTransaction} = require('../controllers/transactions')

router
    .post('/transaction', 
        decodeJWT, 
        validateCredentials, 
        postTransaction
    )
    .get('/transaction-by-period',
        decodeJWT,
        validateCredentials,
        findTranPeriod
    )
    .get('/total-by-period',
        decodeJWT,
        validateCredentials,
        getPeriodTotal
    )
    .get('/single-transaction',
        decodeJWT,
        validateCredentials,
        getSingleTransaction
    )
    .delete('/single-transaction',
        decodeJWT,
        validateCredentials,
        deleteSingleTransaction
    )
    


module.exports = router;