const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postBudgetTransaction} = require('../controllers/budget');

router
    .route('/transaction-single')
    .post(
        decodeJWT,
        validateCredentials,
        postBudgetTransaction
    )
    .get(decodeJWT,validateCredentials)
    .put(decodeJWT,validateCredentials)
    .delete(decodeJWT,validateCredentials)

router
    .get('transactions-by-period',
        decodeJWT,
        validateCredentials
    )
    .get('total-by-period',
        decodeJWT,
        validateCredentials
    )
    .get('transactions-all',
        decodeJWT,
        validateCredentials
    )

module.exports = router;