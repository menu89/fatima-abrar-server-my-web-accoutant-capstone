const express = require('express');
const router = express.Router();

const decodeJWT = require('../middleware/decodeJWT');
const {validateCredentials} = require('../middleware/checkCredentials');

const {userRegistration, userLogin, authenticateUser, addBankInfo} = require('../controllers/usersignin');
const {addNewUser, findUser, addBankAcc, findBankList} = require('../models/usermodels');

router
    .post('/register', 
        userRegistration, 
        addNewUser
    )
    //get
    .post('/login', 
        userLogin, 
        findUser, 
        authenticateUser
    )
    .post('/initial-set-up', 
        decodeJWT, 
        validateCredentials, 
        addBankInfo, 
        addBankAcc
    )
    .get('/bank-list',
        decodeJWT,
        validateCredentials,
        findBankList
    )

    //.get('/user/initial-set-up', decodeJWT, addBankInfo)

module.exports = router;