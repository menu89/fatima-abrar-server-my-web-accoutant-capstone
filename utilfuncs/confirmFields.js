
function confirmRegisFields(username, email, password, confirmpassword) {
    if ( !username || !email || !password || !confirmpassword) {
        const errorList = []
        if (!username) {errorList.push('username')}
        if (!email) {errorList.push('email')}
        if (!password) {errorList.push('password')}
        if (!confirmpassword) {errorList.push('confirm password')}
        
        const errorString = errorList.join(", ")

        return { 
            code: 400, 
            message:`Please enter all the required fields. The following fields are missing: ${errorString}`
        }
    }

    if (password !== confirmpassword) {
        return {
            code:400,
            message: "Passwords do not match."
        }
    }

    return { code: 200}
}

function confirmLoginFields(email, password) {
    const errorList = []
    if (!email || !password) {
        if (!email) {errorList.push('email')}
        if (!password) {errorList.push('password')}

        const errorString = errorList.join(", ")
        
        return { 
            code: 400, 
            message:`Please enter all the required fields. The following fields are missing: ${errorString}`
        }
    }

    return { code: 200}
}

module.exports = {
    confirmRegisFields,
    confirmLoginFields
}