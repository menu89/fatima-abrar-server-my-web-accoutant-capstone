const express = require('express');
const router = express.Router();

const {userRegistration, userLogin} = require('../controllers/usersignin');
const {addNewUser} = require('../models/usermodels')


router
    .post('/user/register', userRegistration, addNewUser)
    .get('/user/login', userLogin)

module.exports = router;