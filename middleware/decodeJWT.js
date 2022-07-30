const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_KEY = process.env.SECRET_KEY

//this function decodes the JWT token received as part of the headers and includes the decoded information under req.user.
const decodeJWT = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send("You must be logged in to access this information!");
    }

    const authToken = req.headers.authorization.split(" ")[1];
    
    jwt.verify(authToken, JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid auth token");
        } 

        req.user = decoded;
        next();
    }); 
};

module.exports = decodeJWT;