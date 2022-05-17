const express = require('express');
const router = express.Router();

const {userRegistration, funcNameTwo} = require('../controllers/usersignin');


router.post('/user/register', userRegistration);

module.exports = router;