const {addNewUser, findUser} = require('../models/usermodels');
const { confirmRegisFields, confirmLoginFields } = require('../utilfuncs/confirmFields');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { response } = require('express');
require('dotenv').config();

const JWT_KEY = process.env.SECRET_KEY

const userRegistration = (req,res) => {
    const { username, email, password, confirmpassword } = req.body

    let returnMsg = confirmRegisFields(username, email, password, confirmpassword)
    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).send(returnMsg.message)
    }

    const protectedPassword = bcrypt.hashSync(password, 12)

    const newUser = {
        username: username,
        email: email,
        password: protectedPassword
    }

    addNewUser(newUser)
    .then(response => {
        return res.status(response.status).json(response.message)
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

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
            return res.status(400).send("Invalid Password")
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




module.exports = {
    userRegistration,
    userLogin
}