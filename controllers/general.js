const {readAccountList} = require('../models/general');

const sendAPIDoc = (_req,res) => {
    return res.status(200).sendFile(_dirname+'../public/index.html')
}

const sendAccountList = (_req,res) => {
    const prepareResponse = readAccountList()
    return res.status(200).send(prepareResponse)
}

module.exports = {
    sendAPIDoc,
    sendAccountList
}