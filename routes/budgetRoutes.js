const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postBudgetTransaction, getSingleBudgetTran, deleteSingleBudgetTranansation, patchSingleBudgetTransaction, getAllBudgetRecords, getBudgetRecordsByPeriod, getBudgetTotalsByPeriod} = require('../controllers/budget');

router
    .route('/single')
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
    .get('/by-period',
        decodeJWT,
        validateCredentials,
        getBudgetRecordsByPeriod
    )
    .get('/totals-by-period',
        decodeJWT,
        validateCredentials,
        getBudgetTotalsByPeriod
    )
    .get('/all',
        decodeJWT,
        validateCredentials,
        getAllBudgetRecords
    )

module.exports = router;