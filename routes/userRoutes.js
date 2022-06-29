const express = require('express');
const router = express.Router();



const {userRegistration, userLogin} = require('../controllers/usersignin');

router
    .post('/register', 
        userRegistration
    )
    //get
    .post('/login', 
        userLogin
    )

module.exports = router;