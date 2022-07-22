const knex = require('knex')(require('../knexfile'));

//this function adds a new user to the users table.
function addNewUser(userInfo) {

    return new Promise((resolve,reject) => {
        knex('users_list')
        .insert(userInfo)
        .then(() => { 
            resolve ({
                status:201,
                message:"Registration Successfull"
            })
        })
        .catch((err) => { 
            if (err.code === 'ER_DUP_ENTRY') {
                reject({
                    status:400,
                    "message":"A user is already registered with this email"
                })
            }
            reject ({
                status:400,
                message:"Registration Failed"
            })
        })
    })
}

//this function looks for a user by id in the users table.
function findUser(email) {
    
    return new Promise((resolve, reject)=>{
        knex('users_list')
        // .select('id', 'username','password')
        .where({email: email})
        .then( (userInfo) => {
            if (userInfo.length === 0) {
                reject ({
                    status:400,
                    message:"There is no user registered with this email"
                })
            }
            resolve(userInfo[0])
        })
        .catch((err) => {
            reject({
                status:400,
                message:"Log in failed"
            })
        })
    })
}

//this function updates information for the user.
function updateUser(email, updateCriterion) {
    return new Promise((resolve, reject) => {
        knex('users_list')
        .update(updateCriterion)
        .where({email:email})
        .then( response => {
            resolve(response)
        })
        .catch(() => {
            return reject({
                status:400,
                message:"Failed to update the requested record."
            })
        })
    })
}

module.exports = {
    addNewUser,
    findUser,
    updateUser
}