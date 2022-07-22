const {addNewUser, findUser, updateUser} = require('../models/usermodels');
const { confirmRegisFields, confirmLoginFields, confirmCodeVerificationFields, confirmForgottenPasswordVerificationFields, confirmChangePasswordFields } = require('../utilfuncs/confirmFields');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_KEY = process.env.SECRET_KEY
const CLIENT_WEBSITE = process.env.DEPLOYMENT_WEBSITE

"use strict";
const nodemailer = require("nodemailer");

//put together user information for emails going out.
let transporter = nodemailer.createTransport({
    host: `${process.env.MAILER_HOST}`,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE,
    auth: {
        user: `${process.env.MAILER_USER}`,
        pass: `${process.env.MAILER_PASSWORD}`
    }
})

//this function generate a random number to represent a pokemon in the API list
function getRandomNum () {
    let returnValue = 0
    while (returnValue === 0) {
        returnValue = Math.floor(Math.random()*1000000000)
    }
    return returnValue
  }

//this function checks the parameters for a new user registration to see if they meet certain conditions. if it does, then it encrypts the password and creates a entry in the users table.
const userRegistration = (req,res) => {
    const { username, email, password, confirmpassword } = req.body

    let returnMsg = confirmRegisFields(username, email, password, confirmpassword)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }

    const protectedPassword = bcrypt.hashSync(password, 12)

    let generateCode = getRandomNum()

    const newUser = {
        username: username,
        email: email,
        password: protectedPassword,
        [`verification-code`]: generateCode
    }

    let messageText = `Hello ${username}, To log into my-web-accountant you'll need to verify your email account. Please use this verificate code:${generateCode} at ${CLIENT_WEBSITE}/verify-account. From the support team at My Web Accountnat`

    let messageHTML =`<html><p>Hello ${username},</p> <p>To log into my-web-accountant you'll need to verify your email account.</p> <p>Please use this verificate code:${generateCode} at ${CLIENT_WEBSITE}/verify-account.</p> <p>From the support team at My Web Accountnat</p></html>`

    const mailPackage = {
        from: process.env.MAILER_USER,
        to:email,
        subject: 'Verify your email',
        text: messageText,
        html: messageHTML
    }

    addNewUser(newUser)
    .then(() => {
        return transporter.sendMail(mailPackage)
    }).then(() => {
        return res.status(200).json('Registration Successful. Please verify your account to proceed with additional requests.')
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

//this function takes the email and password. decrypts the password to see if it matches the one in the users table and returns a JWT token if it does.
const userLogin = (req,res) => {
    const {email, password} = req.body

    const returnMsg = confirmLoginFields(email, password)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }

    findUser(email)
    .then( foundUser => {
        const isPasswordCorrect = bcrypt.compareSync( password, foundUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json("Invalid Password")
        }
        if (foundUser['account-verified'] === 0) {
            return res.status(400).json('Please verify your account to proceed.')
        }
        const token = jwt.sign(
            {id: foundUser.id, email: email,username:foundUser.username},
            JWT_KEY,
            { expiresIn: '24h'}
        )
    
        res.status(200).json({token})
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

//this function takes the email and verification code and checks to see if they match the information in the users table.
const verifyEmail = (req, res) =>{
    const {email, verificationCode} = req.body

    const returnMsg = confirmCodeVerificationFields(email, verificationCode)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }

    const code = parseInt(verificationCode)

    let doNotContinue = 0

    findUser(email)
    .then( foundUser => {
        if (foundUser['verification-code'] !== code) {
            doNotContinue = 1
            return res.status(400).json('Please recheck the validation code and email provided.')
        }

        if (foundUser['account-verified'] === 1) {
            doNotContinue = 1
            return res.status(200).json('Your account is already verified.')
        }

        const updateCriterion = {[`account-verified`]:1,['verification-code']:0}
        return updateUser(email, updateCriterion)
    })
    .then(() => {
        if (doNotContinue === 0) {
            let messageText = `Thank you. Your account is now verified. You can proceed with your log in. From the support team at My Web Accountnat`

            let messageHTML =`<html><p>Thank you. Your account is now verified. You can proceed with your log in.</p> <p>From the support team at My Web Accountnat</p></html>`

            const mailPackage = {
                from: process.env.MAILER_USER,
                to:email,
                subject: 'Account Registered.',
                text: messageText,
                html: messageHTML
            }
            
            return transporter.sendMail(mailPackage)
        }
    })
    .then(() => {
        if (doNotContinue === 0) {
            return res.status(200).json('Thank you! Your account is now verified.')
        }
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

//this function takes the current password and validates it. if the password is correct, then it encrypts the new password and updates the tables with the new password.
const changePassword = (req, res) => {
    const dataReceipt = {...req.body}
    const {email, password, newPassword} = req.body

    const returnMsg = confirmChangePasswordFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }

    const protectedPassword = bcrypt.hashSync(newPassword, 12)

    let doNotContinue = 0

    findUser(email)
    .then( foundUser => {
        const isPasswordCorrect = bcrypt.compareSync( password, foundUser.password);
        if (!isPasswordCorrect) {
            doNotContinue = 1
            return res.status(400).json("Invalid Password. Your old password needs to be correct to update the new password.")
        }

        const updateCriterion = {password:protectedPassword}
        return updateUser(email, updateCriterion)
    })
    .then(() => {
        if (doNotContinue === 0) {
            let messageText = `You have successfully changed your password. From the support team at My Web Accountnat`

            let messageHTML =`<html><p>You have successfully changed your password.</p> <p>From the support team at My Web Accountnat</p></html>`

            const mailPackage = {
                from: process.env.MAILER_USER,
                to:email,
                subject: 'Password Change successful.',
                text: messageText,
                html: messageHTML
            }

            return transporter.sendMail(mailPackage)
        }
    })
    .then(() => {
        if (doNotContinue === 0) {
            return res.status(200).json('Your password has been updated. You can now log in with your new password.')
        }
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

//this function checks to see if all required fields are there. It then encrypts the password. it looks for the user and compares the verification code, if the verification code is correct, it updates the password.
const forgotPassword = (req, res) => {
    const dataReceipt = {...req.body}
    const {email, passwordVerificationCode, newPassword} = req.body

    const returnMsg = confirmForgottenPasswordVerificationFields(dataReceipt)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }

    const code = parseInt(passwordVerificationCode)
    const protectedPassword = bcrypt.hashSync(newPassword, 12)

    let doNotContinue = 0

    findUser(email)
    .then( foundUser => {
        if (foundUser[`password-verification-code`] !== code) {
            doNotContinue = 1
            return res.status(400).json('Please recheck the validation code and email provided.')
        }

        const updateCriterion = {[`password-verification-code`]:0,password:protectedPassword}
        return updateUser(email, updateCriterion)
    })
    .then(() => {
        if (doNotContinue === 0) {
            let messageText = `You have successfully changed your password. From the support team at My Web Accountnat`

            let messageHTML =`<html><p>You have successfully changed your password.</p> <p>From the support team at My Web Accountnat</p></html>`

            const mailPackage = {
                from: process.env.MAILER_USER,
                to:email,
                subject: 'Password Change successful.',
                text: messageText,
                html: messageHTML
            }
            
            return transporter.sendMail(mailPackage)
        }
    })
    .then(() => {
        if (doNotContinue === 0) {
            return res.status(200).json('Your password has been updated. You can now log in with your new password.')
        }
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

//this function takes email address as a query and resends the verification code.
const resendVerificationCode = (req,res) => {
    const { email } = req.query

    if (!email) {
        return res.status(400).send('Please provide the email address.')
    }

    let generateCode = 0
    let username = ''
    let doNotContinue = 0

    findUser(email)
    .then((foundUser) => {

        if (foundUser[`account-verified`] === 1) {
            doNotContinue = 1
            return res.status(200).json('Your email address is already verified.')
        }
        username = foundUser.username
        generateCode = getRandomNum()
        const updateCriterion = {[`verification-code`]: generateCode}
        return updateUser(email, updateCriterion)
    })
    .then(() => {
        if (doNotContinue === 0) {
            let messageText = `Hello ${username}, To log into my-web-accountant you'll need to verify your email account. Please use this verificate code:${generateCode} at ${CLIENT_WEBSITE}/verify-account. From the support team at My Web Accountnat`

            let messageHTML =`<html><p>Hello ${username},</p> <p>To log into my-web-accountant you'll need to verify your email account.</p> <p>Please use this verificate code:${generateCode} at ${CLIENT_WEBSITE}/verify-account.</p> <p>From the support team at My Web Accountnat</p></html>`
    
            const mailPackage = {
                from: process.env.MAILER_USER,
                to:email,
                subject: 'Verify your email',
                text: messageText,
                html: messageHTML
            }
    
            return transporter.sendMail(mailPackage)
        }
    })
    .then(() => {
        if (doNotContinue === 0) {
            return res.status(200).json('Verification code resent. Check your email for the new code.')
        }
    })
    .catch(err => {
        res.status(err.status).json(err.message)
    })
    

}

//this function takes the email address, searches for user and attaches a unique code to the user for a forgotten password. It then emails that password to the user.
const sendPasswordResetCode = (req, res) => {
    const { email } = req.query

    if (!email) {
        return res.status(400).send('Please provide the email address.')
    }

    let generateCode = 0
    let username = ''
    
    findUser(email)
    .then((foundUser) => {

        username = foundUser.username
        generateCode = getRandomNum()
        const updateCriterion = {[`password-verification-code`]: generateCode}
        return updateUser(email, updateCriterion)
    })
    .then(() => {
        let messageText = `Hello ${username}, A request for a forgotten password was made for this email address. Please use the following verification code to create a new password:${generateCode} at ${CLIENT_WEBSITE}/forgotten-password. From the support team at My Web Accountnat`

        let messageHTML =`<html><p>Hello ${username},</p> <p>A request for a forgotten password was made for this email address. </p> <p>Please use the following verification code to create a new password:${generateCode} at ${CLIENT_WEBSITE}/forgotten-password.</p> <p>From the support team at My Web Accountnat</p></html>`
    
        const mailPackage = {
            from: process.env.MAILER_USER,
            to:email,
            subject: 'Change forgotten password.',
            text: messageText,
            html: messageHTML
        }
    
        return transporter.sendMail(mailPackage)
    })
    .then(() => {
        return res.status(200).json('Verification code sent. Check your email for the code.')
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}


module.exports = {
    userRegistration,
    userLogin,
    verifyEmail,
    changePassword,
    forgotPassword,
    resendVerificationCode,
    sendPasswordResetCode
}