const accountListData = require('../data/accTypes.json');
const accList = accountListData.filter((acc) => ( acc.type !== "other"))

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

function confirmBankingFields(accType, accDesc, amount) {
    const errorList = []
    if (!accType || !accDesc || !amount) {
        if (!accType) {errorList.push('Account Type')}
        if (!accDesc) {errorList.push('Account Description')}
        if (!amount) {errorList.push('Amount')}
        const errorString = errorList.join(", ")

        return { 
            code: 400, 
            message:`Please enter all the required fields. The following fields are missing: ${errorString}`
        }
    }

    return { code: 200}
}

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

    const startDate = Date.parse("Jan 1 2022")

    if (!parseInt(transaction_timestamp)) {
        const currentDate = Date.parse(transaction_timestamp)
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

    if (parseInt(transaction_timestamp) < startDate) {
        return {
            code:400,
            message: 'This API does not support entering records prior to Jan 1 2022'
        }
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

module.exports = {
    confirmRegisFields,
    confirmLoginFields,
    confirmBankingFields,
    confirmTransactionFields
}