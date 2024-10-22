const express = require('express');
const router = express.Router();
const PublicControllers = require('../controllers/public');
const middlewares = require('../middlewares');

router.post('/uploadFile', middlewares.limiterForFile, middlewares.awsUpload.single('file'), PublicControllers.uploadFile)
router.get("/regenerateAccountLink/:acctId",middlewares.limiter, PublicControllers.regenerateAccountLink)

module.exports = router 