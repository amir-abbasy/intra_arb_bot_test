const express = require('express')
const router = express.Router()
const fetchOHLCV = require('../controllers/crypto/fetchOHLCV')


router.get('/fetchOHLCV', fetchOHLCV)

module.exports = router;