const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postTransfer, getSingleTransfer, deleteSingleTransfer, patchSingleTransfer, getAllTransfers} = require('../controllers/transfers');

router
    .route('/transaction-single')
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
    .get('/transaction-all',
        decodeJWT,
        validateCredentials,
        getAllTransfers
    )

module.exports = router;