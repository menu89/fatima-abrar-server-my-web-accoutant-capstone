const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {userRegistration, userLogin, addBankInfo, findBanks} = require('../controllers/usersignin');

router
    .post('/register', 
        userRegistration
    )
    //get
    .post('/login', 
        userLogin
    )
    .post('/initial-set-up', 
        decodeJWT, 
        validateCredentials, 
        addBankInfo
    )
    .get('/bank-list',
        decodeJWT,
        validateCredentials,
        findBanks
    )

module.exports = router;