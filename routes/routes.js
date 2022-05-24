const express = require('express');
const router = express.Router();

router.use(express.static('public'));

const {sendAPIDoc} = require('../controllers/general')

const {userRegistration, userLogin, authenticateUser, addBankInfo} = require('../controllers/usersignin');
const {addNewUser, findUser, validateCredentials, addBankAcc, findBankAcc} = require('../models/usermodels');

const decodeJWT = require('../controllers/decodeJWT');

const {checkTransactions, addTransactions, checkTranPeriod, sendTotalByPeriod} = require('../controllers/transactions')
const {addNewTran, findTranByPeriod, findDebitByPeriod, findCreditByPeriod} = require('../models/transactionsmodels')


router
    .get('/', sendAPIDoc)
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
    .get('/user/total-by-period',
        decodeJWT,
        validateCredentials,
        checkTranPeriod,
        findDebitByPeriod,
        findCreditByPeriod,
        sendTotalByPeriod
    )
    //.get('/user/initial-set-up', decodeJWT, addBankInfo)

module.exports = router;