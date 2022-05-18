const express = require('express');
const router = express.Router();

const {userRegistration, userLogin, authenticateUser, addBankInfo} = require('../controllers/usersignin');
const {addNewUser, findUser, validateCredentials, addBankAcc} = require('../models/usermodels');
const decodeJWT = require('../controllers/decodeJWT');


router
    .post('/user/register', userRegistration, addNewUser)
    .get('/user/login', userLogin, findUser, authenticateUser)
    .post('/user/initial-set-up', decodeJWT, validateCredentials, addBankInfo, addBankAcc)
    //.get('/user/initial-set-up', decodeJWT, addBankInfo)

module.exports = router;