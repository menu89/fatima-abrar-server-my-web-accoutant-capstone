const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {addBankInfo, findBanks} = require('../controllers/banks');

router
    .post('/add-bank-account', 
        decodeJWT, 
        validateCredentials, 
        addBankInfo
    )
    .get('/list',
        decodeJWT,
        validateCredentials,
        findBanks
    )

module.exports = router;