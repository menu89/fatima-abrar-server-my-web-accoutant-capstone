const accountListData = require('../data/accTypes.json');
const accList = accountListData.filter((acc) => ( acc.type !== "other"))
const startDate = Date.parse("Jan 1 2022")

//this function takes tot fields provided for a new user registration and checks to see if they are all there and that they meet certain criterion.
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

//this function takes the log in fields and checks them.
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

//this function takes the verification fields and checks them
function confirmCodeVerificationFields(email, verificationCode) {
    const errorList = []
    if (!email || !verificationCode) {
        if (!email) {errorList.push('email')}
        if (!verificationCode) {errorList.push('verification code')}

        const errorString = errorList.join(", ")
        
        return { 
            code: 400, 
            message:`Please enter all the required fields. The following fields are missing: ${errorString}`
        }
    }

    return { code: 200}
}

//this function takes the verification fields for forgotten passwords and checks them
function confirmForgottenPasswordVerificationFields(dataReceipt) {
    const { email, passwordVerificationCode, newPassword, confirmNewPassword } = dataReceipt

    const errorList = []
    if (!email || !passwordVerificationCode || !newPassword || !confirmNewPassword) {
        if (!email) {errorList.push('email')}
        if (!passwordVerificationCode) {errorList.push('password verification code')}
        if (!newPassword) {errorList.push('the new password')}
        if (!confirmNewPassword) {errorList.push('confirm new password')}

        const errorString = errorList.join(", ")
        
        return { 
            code: 400, 
            message:`Please enter all the required fields. The following fields are missing: ${errorString}`
        }
    }

    if (newPassword !== confirmNewPassword) {
        return {
            status:400,
            message: "The passwords do not match."
        }
    }

    return { code: 200}
}

//this function takes the verification fields for changing passwords and checks them.
function confirmChangePasswordFields(dataReceipt) {
    const { email, password, newPassword, confirmNewPassword } = dataReceipt

    const errorList = []
    if (!email || !password || !newPassword || !confirmNewPassword) {
        if (!email) {errorList.push('email')}
        if (!password) {errorList.push('current password')}
        if (!newPassword) {errorList.push('the new password')}
        if (!confirmNewPassword) {errorList.push('confirm new password')}

        const errorString = errorList.join(", ")
        
        return { 
            code: 400, 
            message:`Please enter all the required fields. The following fields are missing: ${errorString}`
        }
    }

    if (newPassword !== confirmNewPassword) {
        return {
            status:400,
            message: "The passwords do not match."
        }
    }

    return { code: 200}
}

//checking the format etc for the timestamp sent
function checkTimeStatmp (timestamp) {
    if (!parseInt(timestamp)) {
        const currentDate = Date.parse(timestamp)
        if (!currentDate) {
            return {
                code: 400,
                message: 'Invalid date format'
            }
        } else if (currentDate < startDate) {
            return {
                code:400,
                message: 'This API does not support entering records prior to Jan 1 2022'
            }
        }       
    }

    if (parseInt(timestamp) < startDate) {
        return {
            code:400,
            message: 'This API does not support entering records prior to Jan 1 2022'
        }
    }

    return {code:200}

}

//this function checks bank account fields to see if they are missing or in the wrong formation. (for posting a new bank account.)
function confirmBankingFields(accType, accDesc, amount, balance_timestamp) {
    const errorList = []
    if (!accType || !accDesc || !amount || !balance_timestamp) {
        if (!accType) {errorList.push('Account Type')}
        if (!accDesc) {errorList.push('Account Description')}
        if (!amount) {errorList.push('Amount')}
        if (!balance_timestamp) {errorList.push("balance date is a madatory field")}
        const errorString = errorList.join(", ")

        return { 
            code: 400, 
            message:`Please enter all the required fields. The following fields are missing: ${errorString}`
        }
    }

    if (accDesc.length > 25) {
        return {
            code:400,
            message:"Account description is too long. Please use 25 or less characters."
        }
    }

    if ((accType !== 'cash') && (accType !== 'savings') && (accType !== 'line-of-credit') && (accType !== 'credit-card') && (accType !== 'chequeing')) {
        return {
            code:400,
            message:"Please use a valid account type. Accepted account types are: 'chequeing', 'credit-card', 'line-of-credit', 'savings', 'cash'"
        }
    }

    const results = checkTimeStatmp(balance_timestamp)

    if (results.code === 400) {
        return results
    }

    return { code: 200}
}

////this function checks the transaction/budget fields to see if they are missing or in the wrong formation. (for posting a new transaction/record.)
function confirmTransactionFields(transactionObject) {
    const {amount, debit, credit, bank_type, transaction_timestamp} = transactionObject

    if (!amount || !debit || !credit || !bank_type || !transaction_timestamp) {
        const errorList =[]
        if (!amount) {errorList.push("amount")}
        if (!debit) {errorList.push("debit")}
        if (!credit) {errorList.push("credit")}
        if (!bank_type) {errorList.push("bank type (c/d")}
        if (!transaction_timestamp) {errorList.push("transaction date is a madatory field")}
        const errorString = errorList.join(", ")

        return {
            code: 400,
            message: `The following fields are madatory: ${errorString}`
        }
    }

    if ((bank_type !== "c") && (bank_type !== "d")) {
        return {
            code: 400,
            message: `the bank type only accepts with "c" for credit or "d" for debit`
        }
    }
    
    const results = checkTimeStatmp(transaction_timestamp)

    if (results.code === 400) {
        return results
    }

    if (debit === credit) {
        return {
            code: 400,
            message: `Debit and Credit fields cannot have the same value`
        }
    }

    if (bank_type === "c") {
        const checkDebit = accList.find((acc) => (acc.name === debit))
        if (!checkDebit) {
            return {
                code: 400,
                message: 'Invalid Debit category. Please refer to API documentation for full list of acceptable accounts'
            }
        }
    } else {
        const checkCredit = accList.find((acc) => (acc.name === credit))
        if (!checkCredit) {
            return {
                code: 400,
                message: 'Invalid Credit category. Please refer to API documentation for full list of acceptable accounts'
            }
        }
    }

    if (!parseInt(amount)) {
        return {
            code: 400,
            message: 'Please recheck amount entered'
        }
    }


    return { code: 200 }

}

//this function checks to see that the parameters provided for an endpoint that searches for information by period, meets certain criterion.
function confirmTranPeriodFields(fieldParameters) {
    const {month, year} = fieldParameters

    if (!month || !year) {
        const errorList = []
        if (!month) {errorList.push('month')}
        if (!year) {errorList.push('year')}
        
        const errorString = errorList.join(", ")

        return {
            code: 400,
            message: `The following fields are madatory: ${errorString}`
        }
    }

    if (!parseInt(month) || !parseInt(year)) {
        return {
            code: 400,
            message: 'check the format of the fields provided. They must be in numerical format. (i.e. 05 for May)'
        }
    }
    
    if ((parseInt(month) > 12) || (parseInt(year) > 2200) || (parseInt(month) <= 0)) {
        
        return {
            code: 400,
            message: 'invalid month and year provided.'
        }
    }

    if (parseInt(year) < 2022) {
        return {
            code:400,
            message: 'This API does not support transaction records prior to Jan 1, 2022'
        }
    }

    return {code: 200}
}

//this function is for updating a transaction or budget item.
//it checks to see if the fields required are present and in the right format.
function confirmUpdateTranFields(updateParams) {
    const {amount, debit, credit, bank_type, transaction_timestamp, description, tranid} = updateParams

    if (!tranid) {
        return ({
            code:400,
            message:"Please provide the id of the transaction being updated."
        })
    }

    if (!!tranid && !parseInt(tranid)) {
        return {
            code: 400,
            message: 'Please recheck tranid entered.'
        }
    }

    if (!amount && !debit && !credit && !transaction_timestamp && !description) {
        return ({
            code: 400,
            message: "Please provide at least one field that you are looking to update."
        })
    }

    if (!!debit || !!credit) {
        if (!bank_type) {
            return ({
                code:400,
                message:"To update the debit or credit account, please provide the bank_type field as well."
            })
        }

        if ((bank_type !== "c") && (bank_type !== "d")) {
            return ({
                code: 400,
                message:`The bank type only accepts "c" for credit or "d" for debit`
            })
        }

        if ((bank_type === "c") && (!!debit)) {
            const checkDebit = accList.find((acc) => (acc.name === debit))
            if (!checkDebit) {
                return {
                    code: 400,
                    message: 'Invalid Debit category. Please refer to API documentation for full list of acceptable accounts'
                }
            }
        } 

        if ((bank_type === "d") && (!!credit)) {
            const checkCredit = accList.find((acc) => (acc.name === credit))
            if (!checkCredit) {
                return {
                    code: 400,
                    message: 'Invalid Credit category. Please refer to API documentation for full list of acceptable accounts'
                }
            }
        }

        if (!!debit && !!credit) {
            if (debit === credit) {
                return {
                    code: 400,
                    message: `Debit and Credit fields cannot have the same value`
                }
            }
        }
    }

    if (!!amount && !parseInt(amount)) {
        return {
            code: 400,
            message: 'Please recheck amount entered'
        }
    }

    if (!!transaction_timestamp) {
        const results = checkTimeStatmp(transaction_timestamp)

        if (results.code === 400) {
            return results
        }
    }

    return ({code: 200})
}

//this function checks the parameters for searches bank transactions by date to see if they meet certain criterion.
function confirmBankTranByDate (validationData) {
    const {bankid, balance_timestamp} = validationData
    if (!bankid || !balance_timestamp) {
        return({
            code:400,
            message:"Please provide all mandatory fields."
        })
    }

    if (!parseInt(bankid)) {
        return({
            code:400,
            message:"Please provide a valid id."
        })
    }
    
    const results = checkTimeStatmp(balance_timestamp)

    if (results.code === 400) {
        return results
    }

    return { code: 200}
}

//this function checks to see if all fields for posting a transaction are present and then chancks that they are in the right format
function confirmTranferFields (validationData) {
    const {amount, debit, credit, transaction_timestamp} = validationData

    if (!amount || !debit || !credit || !transaction_timestamp) {
        const errorList =[]
        if (!amount) {errorList.push("amount")}
        if (!debit) {errorList.push("debit")}
        if (!credit) {errorList.push("credit")}
        if (!transaction_timestamp) {errorList.push("transaction date is a madatory field")}
        const errorString = errorList.join(", ")

        return {
            code: 400,
            message: `The following fields are madatory: ${errorString}`
        }
    }
   
    const results = checkTimeStatmp(transaction_timestamp)

    if (results.code === 400) {
        return results
    }

    if (debit === credit) {
        return {
            code: 400,
            message: `Debit and Credit fields cannot have the same value`
        }
    }

    if (!parseInt(amount)) {
        return {
            code: 400,
            message: 'Please recheck amount entered'
        }
    }


    return { code: 200 }

}

//this function is for updating a transfer item.
//it checks to see if the fields required are present and in the right format.
function confirmUpdateTransferFields(updateParams) {
    const {amount, debit, credit, transaction_timestamp, description, tranid} = updateParams

    if (!tranid) {
        return ({
            code:400,
            message:"Please provide the id of the transaction being updated."
        })
    }

    if (!!tranid && !parseInt(tranid)) {
        return {
            code: 400,
            message: 'Please recheck tranid entered.'
        }
    }

    if (!amount && !debit && !credit && !transaction_timestamp && !description) {
        return ({
            code: 400,
            message: "Please provide at least one field that you are looking to update."
        })
    }

    if (!!debit && !!credit) {
        if (debit === credit) {
            return {
                code: 400,
                message: `Debit and Credit fields cannot have the same value`
            }
        }
    }
    
    if (!!amount && !parseInt(amount)) {
        return {
            code: 400,
            message: 'Please recheck amount entered'
        }
    }

    if (!!transaction_timestamp) {
        const results = checkTimeStatmp(transaction_timestamp)

        if (results.code === 400) {
            return results
        }
    }

    return ({code: 200})
}

module.exports = {
    confirmRegisFields,
    confirmLoginFields,
    confirmBankingFields,
    confirmTransactionFields,
    confirmTranPeriodFields,
    confirmUpdateTranFields,
    confirmBankTranByDate,
    confirmTranferFields,
    confirmUpdateTransferFields,
    confirmCodeVerificationFields,
    confirmForgottenPasswordVerificationFields,
    confirmChangePasswordFields
}