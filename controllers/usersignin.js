const { writeFiles, readFiles, addNewUser} = require('../models/usermodels');
const { confirmRegisFields, confirmLoginFields } = require('../utilfuncs/confirmFields');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

const userLogin = (req,res) => {
    const {username, password} = req.body

    if (!username || !password) {
        const errorList = confirmLoginFields(username, password)
        res.status(400).send(`The following fields are missing: ${errorList.join(", ")}`)
    }
}

module.exports = {
    userRegistration,
    userLogin
}