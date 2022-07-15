const knex = require('knex')(require('../knexfile'));

const fs = require('fs');
const accList = './data/accTypes.json';

//gets the list of accounts from data sheet
function readAccountList() {
    const readList = JSON.parse(fs.readFileSync(accList))
    return readList
}

//breaks down the data from the read list into three arrays
function compileListBreakdown() {
    const fullList = readAccountList()
    let expenseArray = []
    let incomeArray = []
    let paymentAccountArray =[]

    fullList.forEach(oneItem => {
        if (oneItem.type === 'other') {
            paymentAccountArray = [...oneItem.list]
        } else if (oneItem.type === 'expense') {
            expenseArray.push(oneItem.name)
        } else if (oneItem.type === 'income') {
            incomeArray.push(oneItem.name)
        }
    })

    return ({
        expenseList:expenseArray,
        incomeList:incomeArray,
        paymentAccTypes: paymentAccountArray
    })
}

//this function searches for the last transaction posted for a given user and returns it.
function findLatestTransactionByTimestamp (id) {
    return new Promise((resolve, reject) =>{
        knex('actual_transactions')
        .where({user_id:id})
        .orderBy('Transaction_timestamp', 'desc')
        .first()
        .then(response => {
            return resolve({response})
        })
        .catch(err => {
            return reject({
                status:400,
                message:"Failed to update the requested record."
            })
        })
    })
}

//this function takes parameters and searches totals for specific periods in the actuals and budget column
function sumCurrentMonthInformation(id, tableType, accountType, accountList, monthIndex, yearValue, periodClassification) {
    
    let searchInTable = ''
    if (tableType === 'actual') {
        searchInTable = 'actual_transactions'
    } else if (tableType === 'budget') {
        searchInTable = 'budget_entries'
    }

    let responseTitle = `${tableType}_${accountType}`
    const startDate = new Date(yearValue,monthIndex,1)
    const endDate = new Date(yearValue,monthIndex+1,0)
    const startDateParse = Date.parse(startDate)
    const endDateParse = Date.parse(endDate)

    let queryParamater = `SELECT
        COALESCE(SUM (-amount),0) as ${responseTitle}
        FROM ${searchInTable}
        WHERE (
            user_id = ${id}
            and Transaction_timestamp BETWEEN ${startDateParse} AND ${endDateParse}
            and Credit in (${accountList})
        ) UNION
        SELECT
        COALESCE(SUM (amount),0)
        FROM ${searchInTable}
        WHERE (
            user_id = ${id}
            and Transaction_timestamp BETWEEN ${startDateParse} AND ${endDateParse}
            and Debit in (${accountList})
        )`

    return new Promise((resolve, reject) => {
        knex.raw(queryParamater)
        .then(response => {
            let sumTotal = 0
            sumTotal += response[0][0][responseTitle]
            if (response[0].length > 1) {sumTotal += response[0][1][responseTitle]}
            
            let responseObj = {
                type:responseTitle,
                amount:sumTotal,
                startDate: startDate,
                endDate: endDate,
                period:periodClassification
            }

            resolve({
                status:200,
                message:responseObj
            })
        })
        .catch(()=>{
            reject({
                status:400,
                message:"We ran into issues executing your request."
            })
        })
    })
}

function sumBankActivity(id, tableType, monthIndex, yearValue){
    
    const startDate = new Date('Jan 1, 2022')
    const startDateParse = Date.parse(startDate)
    const endDate = new Date(yearValue,monthIndex,0)
    const endDateParse = Date.parse(endDate)

    let searchInTable = ''
    if (tableType === 'actual') {
        searchInTable = 'actual_transactions'
    } else if (tableType === 'transfers') {
        searchInTable = 'transfers'
    }
    //console.log('here')

    let queryParamater =`SELECT
            opening_bank_balances.acc_type,
            sum(+ ${searchInTable}.amount) AS sumTotal
        FROM ${searchInTable}
            INNER JOIN opening_bank_balances ON acc_des = ${searchInTable}.Debit
        WHERE
            ${searchInTable}.user_id = ${id}
            AND opening_bank_balances.user_id = ${id}
            AND ${searchInTable}.Transaction_timestamp BETWEEN ${startDateParse} AND ${endDateParse}
        GROUP BY acc_type
        UNION
        SELECT
            opening_bank_balances.acc_type,
            sum(- ${searchInTable}.amount)
        FROM ${searchInTable}
            INNER JOIN opening_bank_balances ON acc_des = ${searchInTable}.Credit
        WHERE
            ${searchInTable}.user_id = ${id}
            AND opening_bank_balances.user_id = ${id}
            AND ${searchInTable}.Transaction_timestamp BETWEEN ${startDateParse} AND ${endDateParse}
        GROUP BY acc_type`

    return new Promise((resolve, reject) => {
        knex.raw(queryParamater)
        .then(response => {
            resolve({
                status:200,
                message:response[0]
            })
        })
        .catch((err)=>{
            console.log(err)
            reject({
                status:400,
                message:"We ran into issues executing your request."
            })
        })
    })
}

//this function looks in the account balances table and returns the sum for each type of account for a specific user
function sumBankInitialBalances(id) {
    return new Promise((resolve, reject) => {
        knex('opening_bank_balances')
        .sum('amount as sumTotal')
        .where({user_id:id})
        .groupBy('acc_type')
        .select('acc_type')
        .then(response => {
            resolve({
                status:200,
                message:response
            })
        })
        .catch((err)=>{
            console.log(err)
            reject({
                status:400,
                message:"We ran into issues executing your request."
            })
        })
    })
}



module.exports = {
    compileListBreakdown,
    findLatestTransactionByTimestamp,
    sumCurrentMonthInformation,
    sumBankActivity,
    sumBankInitialBalances
}