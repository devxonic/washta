const express = require('express');
const router = express.Router();
const CustomerControllers = require('../controllers/Customer');
const middlewares = require('../middlewares');


router.get('/Profile' , middlewares.verifyCustomer,  CustomerControllers.getProfile)
router.patch('/Profile' , middlewares.verifyCustomer,  CustomerControllers.editProfile)
router.get('/notificationSetting' , middlewares.verifyCustomer,  CustomerControllers.getNotificationSetting)
router.patch('/notificationSetting' , middlewares.verifyCustomer,  CustomerControllers.updateNotificationSetting)
router.get('/securitySetting' , middlewares.verifyCustomer,  CustomerControllers.getSecuritySetting)
router.patch('/securitySetting' , middlewares.verifyCustomer,  CustomerControllers.updateSecuritySetting)
router.get('/privacySetting' , middlewares.verifyCustomer,  CustomerControllers.getPrivacySetting)
router.patch('/privacySetting' , middlewares.verifyCustomer,  CustomerControllers.updatePrivacySetting)

router.get('/vehicle' , middlewares.verifyCustomer,  CustomerControllers.getVehicles)
router.post('/vehicle' , middlewares.verifyCustomer,  CustomerControllers.addVehicles)
router.patch('/vehicle/:id' , middlewares.verifyCustomer,  CustomerControllers.updateVehicles)
router.delete('/vehicle/:id' , middlewares.verifyCustomer,  CustomerControllers.DeleteVehicle)
router.get('/Selectcar' , middlewares.verifyCustomer,  CustomerControllers.getIsSelected)
router.patch('/Selectcar' , middlewares.verifyCustomer,  CustomerControllers.updateIsSelected)

module.exports = router 