const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {postTransfer} = require('../controllers/transfers');

router
    .post('/transaction-single',
        decodeJWT,
        validateCredentials,
        postTransfer
    )

module.exports = router;