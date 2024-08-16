const express = require('express');
const router = express.Router();
const FileControllers = require('../controllers/file');
const middlewares = require('../middlewares');

router.post('/uploadFile' ,middlewares.limiterForFile ,  middlewares.awsUpload.single('file'), FileControllers.uploadFile)

module.exports = router 