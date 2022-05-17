const express = require('express');
const router = express.Router();

const {userRegistration, userLogin} = require('../controllers/usersignin');


router
    .post('/user/register', userRegistration)
    .get('/user/login', userLogin)

module.exports = router;