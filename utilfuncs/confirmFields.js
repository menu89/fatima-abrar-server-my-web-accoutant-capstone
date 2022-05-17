function confirmRegisFields(username, email, password, confirmpassword) {
    const errorList = []
    if (!username) {errorList.push('username')}
    if (!email) {errorList.push('email')}
    if (!password) {errorList.push('password')}
    if (!confirmpassword) {errorList.push('confirm password')}
    return errorList
}

function confirmLoginFields(username,password) {
    const errorList = []
    if (!username) {errorList.push('username')}
    if (!password) {errorList.push('password')}
    return errorList
}

module.exports = {
    confirmRegisFields,
    confirmLoginFields
}