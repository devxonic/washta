const express = require('express');
const router = express.Router();
const CustomerControllers = require('../controllers/Customer');
const middlewares = require('../middlewares');


router.get('/Profile' , middlewares.verifyCustomer,  CustomerControllers.getProfile)
router.patch('/Profile' ,middlewares.verifyCustomer, CustomerControllers.editProfile)
router.get('/notificationSetting' , middlewares.verifyCustomer, CustomerControllers.getNotificationSetting)
router.patch('/notificationSetting' , middlewares.verifyCustomer, CustomerControllers.updateNotificationSetting)
router.get('/privacySetting' , middlewares.verifyCustomer, CustomerControllers.getPrivacySetting)
router.patch('/privacySetting' , middlewares.verifyCustomer, CustomerControllers.updateSecuritySetting)
router.get('/securitySetting' , middlewares.verifyCustomer, CustomerControllers.getSecuritySetting)
router.patch('/securitySetting' , middlewares.verifyCustomer, CustomerControllers.updateSecuritySetting)

module.exports = router 