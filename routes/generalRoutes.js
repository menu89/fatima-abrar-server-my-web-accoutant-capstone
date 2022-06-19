const express = require('express');
const router = express.Router();

router.use(express.static('public'));

const {sendAPIDoc, sendAccountList} = require('../controllers/general');

router
    .get('/', sendAPIDoc)
    .get('/account-list', sendAccountList)

module.exports = router;