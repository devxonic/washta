const express = require('express');
const router = express.Router();
const FileControllers = require('../controllers/file');
const middlewares = require('../middlewares');
const { TestNotification } = require('../helpers/notification');

router.post('/uploadFile', middlewares.limiterForFile, middlewares.awsUpload.single('file'), FileControllers.uploadFile)
router.post('/SendNotification', middlewares.limiter, TestNotification)

module.exports = router 