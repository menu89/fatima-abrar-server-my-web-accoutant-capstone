const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postTransaction, getTranPeriod, getPeriodTotal, getSingleTransaction, deleteSingleTransaction, getAllTransactions, patchSingleTransaction} = require('../controllers/transactions')

router
    .post('/single', 
        decodeJWT, 
        validateCredentials, 
        postTransaction
    )
    .get('/by-period',
        decodeJWT,
        validateCredentials,
        getTranPeriod
    )
    .get('/totals-by-period',
        decodeJWT,
        validateCredentials,
        getPeriodTotal
    )
    .get('/all',
        decodeJWT,
        validateCredentials,
        getAllTransactions
    )
    .get('/single',
        decodeJWT,
        validateCredentials,
        getSingleTransaction
    )
    .patch('/single',
        decodeJWT,
        validateCredentials,
        patchSingleTransaction
    )
    .delete('/single',
        decodeJWT,
        validateCredentials,
        deleteSingleTransaction
    )
    


module.exports = router;