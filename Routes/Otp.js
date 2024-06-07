const express = require('express');
const router = express.Router();
const OtpControllers = require('../controllers/Otp');
const middlewares = require('../middlewares');


router.post('/sendOTP' , OtpControllers.sendOTP)
router.post('/verifyCode' , OtpControllers.VerifyCode)
router.post('/setPassword' , OtpControllers.setPassword)
router.post('/verifiction' , OtpControllers.userVerifiaction)

module.exports = router 