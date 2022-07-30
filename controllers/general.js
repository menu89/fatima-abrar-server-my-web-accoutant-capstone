const {readAccountList} = require('../models/generalmodels');

//this function returns the index.html page under public detailing the API documentation
const sendAPIDoc = (_req,res) => {
    return res.status(200).sendFile(_dirname+'../public/index.html')
}

//this function searches for the list of allowed accounts for debit/credit in the AccTypes json file and returns it.
const sendAccountList = (_req,res) => {
    const prepareResponse = readAccountList()
    return res.status(200).send(prepareResponse)
}

module.exports = {
    sendAPIDoc,
    sendAccountList
}