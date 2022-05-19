const express = require('express');
const router = express.Router();

const {userRegistration, userLogin, authenticateUser, addBankInfo} = require('../controllers/usersignin');
const {addNewUser, findUser, validateCredentials, addBankAcc, findBankAcc} = require('../models/usermodels');

const decodeJWT = require('../controllers/decodeJWT');

const {checkTransactions, addTransactions, checkTranPeriod} = require('../controllers/transactions')
const {addNewTran, findTranByPeriod} = require('../models/transactionsmodels')


router
    .post('/user/register', 
        userRegistration, 
        addNewUser
    )
    .get('/user/login', 
        userLogin, 
        findUser, 
        authenticateUser
    )
    .post('/user/initial-set-up', 
        decodeJWT, 
        validateCredentials, 
        addBankInfo, 
        addBankAcc
    )
    .post('/user/transaction', 
        decodeJWT, 
        validateCredentials, 
        checkTransactions, 
        findBankAcc, 
        addTransactions,
        addNewTran
    )
    .get('/user/transaction-by-period',
        decodeJWT,
        validateCredentials,
        checkTranPeriod,
        findTranByPeriod
    )
    //.get('/user/initial-set-up', decodeJWT, addBankInfo)

module.exports = router;