const express = require('express');
const router = express.Router();
const SellerControllers = require('../controllers/Seller');
const middlewares = require('../middlewares');

// ----------------------------------------------- Profile -----------------------------------------------------//

router.get('/Profile' , middlewares.verifySeller,  SellerControllers.getProfile)
router.patch('/Profile' , middlewares.verifySeller,  SellerControllers.editProfile)

// ----------------------------------------------- Settings -----------------------------------------------------//

router.get('/notificationSetting' , middlewares.verifySeller,  SellerControllers.getNotificationSetting)
router.patch('/notificationSetting' , middlewares.verifySeller,  SellerControllers.updateNotificationSetting)
router.get('/securitySetting' , middlewares.verifySeller,  SellerControllers.getSecuritySetting)
router.patch('/securitySetting' , middlewares.verifySeller,  SellerControllers.updateSecuritySetting)
router.get('/privacySetting' , middlewares.verifySeller,  SellerControllers.getPrivacySetting)
router.patch('/privacySetting' , middlewares.verifySeller,  SellerControllers.updatePrivacySetting)

// ----------------------------------------------- Business -----------------------------------------------------//

router.get('/Business' , middlewares.verifySeller,  SellerControllers.getBusiness)
router.post('/Business' , middlewares.verifySeller,  SellerControllers.addBusiness)
router.patch('/Business' , middlewares.verifySeller,  SellerControllers.updateBusiness)


module.exports = router 