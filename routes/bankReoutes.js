const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postBankInfo, getBankList, deleteBankAccount} = require('../controllers/banks');

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

module.exports = router;