const { writeFiles, readFiles, addNewUser} = require('../models/usermodels');
const { confirmRegisFields, confirmLoginFields } = require('../utilfuncs/confirmFields');
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

module.exports = {
    userRegistration,
    userLogin,
    authenticateUser
}