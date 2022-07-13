const {findBankAccounts, addNewTransfer, findLastTransfer, findSingleTransfer, deleteSingleTransferRecord} = require('../models/transfermodels');

const { confirmTranferFields } = require('../utilfuncs/confirmFields');
const { organizeTranferInfo } = require('../utilfuncs/organizeInfo');

//this function recieves the information for a new transfer, checks to see all mandatory fields are present and in the correct format. Then it checks to see if the two bank accounts actually exist. and if they do, it posts the transfer.
function postTransfer (req, res) {
    const dataReceipt = {...req.body, ...req.user}
    const returnMsg = confirmTranferFields(dataReceipt)

    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }

    findBankAccounts(dataReceipt)
    .then(() => {
        return addNewTransfer(organizeTranferInfo(dataReceipt))
    })
    .then(() => {
        return findLastTransfer(dataReceipt.id)
    })
    .then( lastTransfer => {
        return res.status(200).json(lastTransfer.response)
    })
    .catch(err => {
        return res.status(err.status).json(err.message)
    })
}

//this function searches for a record for a given user by the specified id
function getSingleTransfer(req, res) {
    const dataReceipt = {...req.query, ...req.user}
    if (!dataReceipt.tranid) {
        return res.status(400).json('Please provide the transaction  id')
    }

    findSingleTransfer(dataReceipt)
    .then(response => {
        return res.status(response.status).json(response.message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

function deleteSingleTransfer(req, res) {
    const dataReceipt = {...req.query, ...req.user}
    if (!dataReceipt.tranid) {
        return res.status(400).json('Please provide the transaction  id')
    }

    deleteSingleTransferRecord(dataReceipt)
    .then(response => {
        return res.status(response.status).json(response.message)
    })
    .catch(error=>{
        return res.status(error.status).json(error.message)
    })
}

module.exports = {
    postTransfer,
    getSingleTransfer,
    deleteSingleTransfer
}