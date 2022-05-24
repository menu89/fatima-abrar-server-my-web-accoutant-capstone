const sendAPIDoc = (_req,res) => {
    return res.status(200).sendFile(_dirname+'../public/index.html')
}

module.exports = {
    sendAPIDoc
}