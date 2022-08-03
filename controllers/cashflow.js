const { findLatestTransactionByTimestamp, compileListBreakdown, sumCurrentMonthInformation, sumBankActivity, sumBankInitialBalances } = require('../models/cashflowModels');

//code repeating for all three types of cashflows.
//Find the date for the last actual transaction, use the month and year from that transaction to pull current period information. determine how many months of budget information is needed.
//also send an opening balance info... accounts initial balance adjusted for transfers and actuals up to end of previous period.
function getInformation(id, noOfMonths) {
    return new Promise((resolve, reject) => {    
        const {expenseList, incomeList, paymentAccTypes} = compileListBreakdown()
        const expenseListString = `'${expenseList.join("', '")}'`
        const incomeListString = `'${incomeList.join("', '")}'`
        let responseObj = {}
        let organizeAccTypeList = {}

        paymentAccTypes.forEach((oneAcc) => {
            organizeAccTypeList[oneAcc] = 0
        })
            
        let latestMonthIndex = 0
        let latestYear = 0
        let successfulCompletion = 0

        findLatestTransactionByTimestamp(id)
        .then(response => {
            let useTimestamp = 0
            if (!response.response) {
                useTimestamp = Date.now()
            } else {
                useTimestamp = response.response.Transaction_timestamp
            }
            latestMonthIndex = (new Date(useTimestamp).getMonth())
            latestYear = new Date(useTimestamp).getFullYear()

            let monthOne = latestMonthIndex + 1
            let monthTwo = latestMonthIndex + 2
            let monthThree = latestMonthIndex + 3
            let monthFour = latestMonthIndex + 4
            let monthFive = latestMonthIndex + 5
            let monthSix = latestMonthIndex + 6
            let monthSeven = latestMonthIndex + 7
            let monthEight = latestMonthIndex + 8
            let monthNine = latestMonthIndex + 9
            let monthTen = latestMonthIndex + 10
            let monthEleven = latestMonthIndex + 11
            let monthTwelve = latestMonthIndex + 12

            let promiseArray = []

            const currentPeriodInformation =[
                sumCurrentMonthInformation(id, 'actual', 'expense', expenseListString,latestMonthIndex,latestYear, 'currentPeriod'),
                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,latestMonthIndex,latestYear, 'currentPeriod'),
                sumCurrentMonthInformation(id, 'actual', 'income', incomeListString, latestMonthIndex,latestYear, 'currentPeriod'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, latestMonthIndex,latestYear, 'currentPeriod')
            ]

            const monthOnetoThree =[
                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthOne,latestYear, 'firstMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthOne,latestYear, 'firstMonth'),
                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthTwo,latestYear, 'secondMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthTwo,latestYear, 'secondMonth'),
                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthThree,latestYear, 'thirdMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthThree,latestYear, 'thirdMonth')
            ]

            const monthFourtoSix = [
                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthFour,latestYear, 'fourthMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthFour,latestYear, 'fourthMonth'),

                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthFive,latestYear, 'fifthMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthFive,latestYear, 'fifthMonth'),

                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthSix,latestYear, 'sixthMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthSix,latestYear, 'sixthMonth')
            ]

            const monthSeventoTwelve =[
                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthSeven,latestYear, 'seventhMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthSeven,latestYear, 'seventhMonth'),

                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthEight,latestYear, 'eighthMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthEight,latestYear, 'eighthMonth'),

                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthNine,latestYear, 'ninethMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthNine,latestYear, 'ninethMonth'),

                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthTen,latestYear, 'tenthMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthTen,latestYear, 'tenthMonth'),

                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthEleven,latestYear, 'eleventhMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthEleven,latestYear, 'eleventhMonth'),

                sumCurrentMonthInformation(id, 'budget', 'expense', expenseListString,monthTwelve,latestYear, 'twelvethMonth'),
                sumCurrentMonthInformation(id, 'budget', 'income', incomeListString, monthTwelve,latestYear, 'twelvethMonth')
            ]

            if (noOfMonths === 3) {
                promiseArray = [...monthOnetoThree]
            } else if (noOfMonths === 6) {
                promiseArray = [...monthOnetoThree, ...monthFourtoSix]
            } else if (noOfMonths === 12) {
                promiseArray = [...monthOnetoThree, ...monthFourtoSix, ...monthSeventoTwelve]
            }
            
            successfulCompletion = 1
            return Promise.all([...currentPeriodInformation,...promiseArray])
                
        })
        .then(response => {   
            if (successfulCompletion === 1) {
                let combineArrays = []
                let organizePeriodData = {}
    
                response.forEach(oneRes => {
                    combineArrays.push(oneRes.message)
                })
    
                combineArrays.forEach((oneArray) => {
                    if (!organizePeriodData[oneArray['period']]) {
                        organizePeriodData[oneArray['period']] = {
                            startDate:oneArray['startDate'],
                            endDate:oneArray['endDate']
                        }
                    }
                    organizePeriodData[oneArray['period']][oneArray['type']] = oneArray['amount']  
                })
                
                responseObj = {...organizePeriodData}
                successfulCompletion = 2
                return Promise.all([
                    sumBankActivity(id, 'actual', latestMonthIndex, latestYear),
                    sumBankActivity(id, 'transfers', latestMonthIndex, latestYear),
                    sumBankInitialBalances(id)
                ])
            }
            
        })
        .then(response => {            
            if (successfulCompletion === 2) {
                let combineResponseArrays = []

                response.forEach(oneObj => {
                    const addedArray = [ ...combineResponseArrays, ...oneObj.message]
                    combineResponseArrays = [...addedArray]
                })
    
                combineResponseArrays.forEach((oneArray) => {
                    organizeAccTypeList[oneArray['acc_type']] += oneArray['sumTotal']
                })
    
                responseObj['opening_account_balances'] = {...organizeAccTypeList}
    
                return resolve(responseObj)
            }
            
        })
        .catch(err => {
            return reject({status:400})
        })
    })
}

//this function specifies 3 months as parameter for # of months and uses supplmentary function to pull information
function getThreeMonthCashflow (req, res) {
    const {id} = req.user

    getInformation(id, 3)
    .then(response => {
        return res.status(200).json(response)
    })
    .catch((err) => {
        return res.status(400).json("We couldn't complete the reqest.")    
    })

}

//this function specifies 6 months as parameter for # of months and uses supplmentary function to pull information
function getSixMonthCashFlow(req, res) {
    const {id} = req.user

    getInformation(id, 6)
    .then(response => {
        return res.status(200).json(response)
    })
    .catch((err) => {
        return res.status(400).json("We couldn't complete the reqest.")    
    })
}

//this function specifies 12 months as parameter for # of months and uses supplmentary function to pull information
function getTwelveMonthCashFlow(req, res) {
    const {id} = req.user

    getInformation(id, 12)
    .then(response => {
        return res.status(200).json(response)
    })
    .catch((err) => {
        return res.status(400).json("We couldn't complete the reqest.")    
    })
}

module.exports = {
    getThreeMonthCashflow,
    getSixMonthCashFlow,
    getTwelveMonthCashFlow
}