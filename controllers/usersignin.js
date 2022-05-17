const { writeFiles, readFiles} = require('../models/usermodels');
const { confirmRegisFields, confirmLoginFields } = require('../utilfuncs/confirmFields');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRegistration = (req,res) => {
    const { username, email, password, confirmpassword } = req.body

    if ( !username || !email || !password || !confirmpassword) {
        const errorList = confirmRegisFields(username, email, password, confirmpassword)
        return res.status(400).send(`Please enter all the required fields. The following fields are missing: ${errorList.join(", ")}`)
    }

    if ( password !== confirmpassword) {
        return res.status(400).send("Passwords do not match")
    }

    const protectedPassword = bcrypt.hashSync(password, 12)

    const newUser = {
        username: username,
        email: email,
        password: protectedPassword
    }

    const response = writeFiles(newUser)

    res.json(response)
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