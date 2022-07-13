const {findBankAccounts, addNewTransfer, findLastTransfer} = require('../models/transfermodels');

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

module.exports = {
    postTransfer
}