const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postTransfer, getSingleTransfer, deleteSingleTransfer, patchSingleTransfer, getAllTransfers, getTransfersByPeriod} = require('../controllers/transfers');

router
    .route('/single')
    .post(
        decodeJWT,
        validateCredentials,
        postTransfer
    )
    .get(
        decodeJWT,
        validateCredentials,
        getSingleTransfer
    )
    .delete(
        decodeJWT,
        validateCredentials,
        deleteSingleTransfer
    )
    .patch(
        decodeJWT,
        validateCredentials,
        patchSingleTransfer
    )

router
    .get('/all',
        decodeJWT,
        validateCredentials,
        getAllTransfers
    )
    .get('/by-period',
        decodeJWT,
        validateCredentials,
        getTransfersByPeriod
    )

module.exports = router;