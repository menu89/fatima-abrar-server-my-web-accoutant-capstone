const knex = require('knex')(require('../knexfile'));

//this middleware function searches for a users record by email. if no records are returned, then the user doesn't exist. if a user is returned by the id does not match the one drcypted from the token, then there is a problem with the token.
//if all validation is successful, then it moves onto the next step.
function validateCredentials (req, res, next) {
    const {id, email} = req.user
    knex('users_list')
        .where({email: email})
        .then((userInfo) => {
            if (userInfo.length === 0) {
                return res.status(400).send("There is no user registered with this email")
            }
            if (id !== userInfo[0].id) {
                return res.status(400).send('Invalid token')
            }
            next()
        })
        .catch((err) => {
            res.status(400).send("Something wrong went with your request.")
        })
}

module.exports = {
    validateCredentials
}