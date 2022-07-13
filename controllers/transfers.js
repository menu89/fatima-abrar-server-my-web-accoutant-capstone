const {findBankAccounts, addNewTransfer, findLastTransfer, findSingleTransfer, deleteSingleTransferRecord, updateSingleTransfer, findSingleBankAccount} = require('../models/transfermodels');

const { confirmTranferFields, confirmUpdateTransferFields } = require('../utilfuncs/confirmFields');
const { organizeTranferInfo, organizeUpdateTransferInfo } = require('../utilfuncs/organizeInfo');

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

//this function searches for a single transaction for a given user and deletes it.
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

//this function validated the information received for update and then organizes it into an object called updateCriterion. There are three possible scneraios:
//if both debit and credit are provided, then it checks to see if the bank accounts exist and if they both do, then it updates the transfer record.
//if only the debit or credit is provided, then it checks to see if the bank exists. finds the transaction and checks to see if updating the records would mean that debit and credit would be the same account. if so, then it will reject the update.
//if any other field is provided, then it will update it.
//as a final step, then updated record will be sent as a response.
function patchSingleTransfer(req,res) {
    const dataReceipt = {...req.user, ...req.body}
    const returnMsg = confirmUpdateTransferFields(dataReceipt)

    if (returnMsg.code === 400) {
        return res.status(returnMsg.code).json(returnMsg.message)
    }

    const updateCriterion = organizeUpdateTransferInfo(dataReceipt)
    
    const {tranid, id} = dataReceipt
    const {debit, credit} = updateCriterion

    if (!debit && !credit) {
        updateSingleTransfer(tranid, id, updateCriterion)
        .then(() => {
            return findSingleTransfer(dataReceipt)
        })
        .then(response => {
            return res.status(response.status).json(response.message)
            })
        .catch(error=>{
            return res.status(error.status).json(error.message)
        })
    } 

    if (!!debit && !!credit) {
        findBankAccounts(dataReceipt)
        .then(() => {
            return updateSingleTransfer(tranid, id, updateCriterion)
        })
        .then(() => {
            return findSingleTransfer(dataReceipt)
        })
        .then(response => {
            return res.status(response.status).json(response.message)
            })
        .catch(error=>{
            return res.status(error.status).json(error.message)
        })
    } else if (!!debit || !!credit) {
        findSingleBankAccount(dataReceipt)
        .then(() => {
            return findSingleTransfer(dataReceipt)
        })
        .then(response => {
            if (!!debit && (response.message[0]['Credit'] === debit)) {
                return res.status(400).json('You are already using this account for credit. Please specify a different account or change both Debit and Credit.')
            }
            if (!!credit && (response.message[0]['Debit'] === credit))  {
                return res.status(400).json('You are already using this account for credit. Please specify a different account or change both Debit and Credit.')
            }

            return updateSingleTransfer(tranid, id, updateCriterion)
        })
        .then(() => {
            return findSingleTransfer(dataReceipt)
        })
        .then(response => {
            return res.status(response.status).json(response.message)
        })
        .catch(error=>{
            return res.status(error.status).json(error.message)
        })
    }
}

module.exports = {
    postTransfer,
    getSingleTransfer,
    deleteSingleTransfer,
    patchSingleTransfer
}