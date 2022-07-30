const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postBankInfo, getBankList, deleteBankAccount, getTransactionsByDate} = require('../controllers/banks');

router
    .post('/add-bank-account', 
        decodeJWT, 
        validateCredentials, 
        postBankInfo
    )
    .get('/list',
        decodeJWT,
        validateCredentials,
        getBankList
    )
    .delete('/single-account',
        decodeJWT,
        validateCredentials,
        deleteBankAccount
    )
    .get('/account-details-by-date',
        decodeJWT,
        validateCredentials,
        getTransactionsByDate
    )

module.exports = router;