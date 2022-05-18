const express = require('express');
const router = express.Router();

const {userRegistration, userLogin, authenticateUser} = require('../controllers/usersignin');
const {addNewUser, findUser} = require('../models/usermodels')


router
    .post('/user/register', userRegistration, addNewUser)
    .get('/user/login', userLogin, findUser, authenticateUser)

module.exports = router;