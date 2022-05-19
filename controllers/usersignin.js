const { confirmRegisFields, confirmLoginFields, confirmBankingFields } = require('../utilfuncs/confirmFields');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_KEY = process.env.SECRET_KEY

const userRegistration = (req,res, next) => {
    const { username, email, password, confirmpassword } = req.body

    let returnMsg = confirmRegisFields(username, email, password, confirmpassword)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }

    const protectedPassword = bcrypt.hashSync(password, 12)

    req.newUser = {
        username: username,
        email: email,
        password: protectedPassword
    }

    next();    
}

const userLogin = (req,res,next) => {
    const {email, password} = req.body

    const returnMsg = confirmLoginFields(email, password)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }
    
    next();
}

const authenticateUser = (req,res) => {
    const {email,password} = req.body
    const foundUser = req.foundUser
    
    const isPasswordCorrect = bcrypt.compareSync( password, foundUser.password);

    if (!isPasswordCorrect) {
        return res.status(400).send("Invalid Password")
    }

    const token = jwt.sign(
        {id: foundUser.id, email: email},
        JWT_KEY,
        { expiresIn: '24h'}
    )

    res.status(200).json({token})
}

const addBankInfo = (req, res, next) => {
    const {accType, accDesc, amount} = req.body
    const returnMsg = confirmBankingFields(accType, accDesc, amount)
    
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }

    const convertNo = parseInt(amount)
    req.newAcc = {
        acc_type: accType,
        acc_des: accDesc,
        amount: convertNo,
        user_id: req.user.id
    };

    next();
}

module.exports = {
    userRegistration,
    userLogin,
    authenticateUser,
    addBankInfo
}