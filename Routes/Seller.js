const express = require('express');
const router = express.Router();
const SellerControllers = require('../controllers/Seller');
const middlewares = require('../middlewares');


router.get('/Profile' , middlewares.verifySeller,  SellerControllers.getProfile)
router.patch('/Profile' , middlewares.verifySeller,  SellerControllers.editProfile)
router.get('/notificationSetting' , middlewares.verifySeller,  SellerControllers.getNotificationSetting)
router.patch('/notificationSetting' , middlewares.verifySeller,  SellerControllers.updateNotificationSetting)
router.get('/securitySetting' , middlewares.verifySeller,  SellerControllers.getSecuritySetting)
router.patch('/securitySetting' , middlewares.verifySeller,  SellerControllers.updateSecuritySetting)
router.get('/privacySetting' , middlewares.verifySeller,  SellerControllers.getPrivacySetting)
router.patch('/privacySetting' , middlewares.verifySeller,  SellerControllers.updatePrivacySetting)

module.exports = router 