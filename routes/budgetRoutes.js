const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postBudgetTransaction, getSingleBudgetTran, deleteSingleBudgetTranansation, patchSingleBudgetTransaction, getAllBudgetRecords, getBudgetRecordsByPeriod} = require('../controllers/budget');

router
    .route('/transaction-single')
    .post(
        decodeJWT,
        validateCredentials,
        postBudgetTransaction
    )
    .get(
        decodeJWT,
        validateCredentials,
        getSingleBudgetTran
    )
    .patch(
        decodeJWT,
        validateCredentials,
        patchSingleBudgetTransaction
    )
    .delete(
        decodeJWT,
        validateCredentials,
        deleteSingleBudgetTranansation
    )

router
    .get('/transactions-by-period',
        decodeJWT,
        validateCredentials,
        getBudgetRecordsByPeriod
    )
    .get('/total-by-period',
        decodeJWT,
        validateCredentials
    )
    .get('/transactions-all',
        decodeJWT,
        validateCredentials,
        getAllBudgetRecords
    )

module.exports = router;