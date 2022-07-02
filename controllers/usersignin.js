const {addNewUser, findUser} = require('../models/usermodels');
const { confirmRegisFields, confirmLoginFields } = require('../utilfuncs/confirmFields');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_KEY = process.env.SECRET_KEY

//this function checks the parameters for a new user registration to see if they meet certain conditions. if it does, then it encrypts the password and creates a entry in the users table.
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