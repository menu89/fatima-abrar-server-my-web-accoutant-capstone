const express = require('express');
const router = express.Router();



const {userRegistration, userLogin, verifyEmail, changePassword, forgotPassword, resendVerificationCode, sendPasswordResetCode} = require('../controllers/usersignin');

router
    .post('/register', 
        userRegistration
    )
    .get('/resend-code',
        resendVerificationCode
    )
    .post('/verify-email',
        verifyEmail
    ) 
    //get
    .post('/login', 
        userLogin
    )
    .patch('/change-password',
        changePassword
    )
    .get('/forgot-password',
        sendPasswordResetCode
    )
    .patch('/forgot-password',
        forgotPassword
    )

module.exports = router;