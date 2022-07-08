const express = require('express')
const router = express.Router()
const entryManage = require('../controllers/entryManage')


router.post('/register', entryManage.register)
router.post('/login', entryManage.login)

module.exports = router;
