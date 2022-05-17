const express = require('express');
const router = express.Router();

const {functName, funcNameTwo} = require('../controllers/usersignin');


router.get('/',functName)

module.exports = router;