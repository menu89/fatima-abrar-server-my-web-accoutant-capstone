const knex = require('knex')(require('../knexfile'));

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