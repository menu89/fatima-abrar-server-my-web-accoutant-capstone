const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {getThreeMonthCashflow, getSixMonthCashFlow, getTwelveMonthCashFlow} = require('../controllers/cashflow');

router 
    .get('/three-month',
        decodeJWT,
        validateCredentials,
        getThreeMonthCashflow
    )
    .get('/six-month',
        decodeJWT,
        validateCredentials,
        getSixMonthCashFlow
    )
    .get('/twelve-month',
        decodeJWT,
        validateCredentials,
        getTwelveMonthCashFlow
    )

module.exports = router;