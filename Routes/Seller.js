const express = require('express');
const router = express.Router();
const SellerControllers = require('../controllers/Seller');
const middlewares = require('../middlewares');

// ----------------------------------------------- Profile -----------------------------------------------------//

router.get('/Profile', middlewares.verifySeller, SellerControllers.getProfile)
router.patch('/Profile', middlewares.verifySeller, SellerControllers.editProfile)
router.post('/uplaodAvatar', middlewares.verifySeller , middlewares.uploadbuffer.single('Avatar'), SellerControllers.uplaodAvatar)
router.patch('/updatePassword', middlewares.verifySeller, SellerControllers.updatePassword)

// ----------------------------------------------- Settings -----------------------------------------------------//

router.get('/notificationSetting', middlewares.verifySeller, SellerControllers.getNotificationSetting)
router.patch('/notificationSetting', middlewares.verifySeller, SellerControllers.updateNotificationSetting)
router.get('/securitySetting', middlewares.verifySeller, SellerControllers.getSecuritySetting)
router.patch('/securitySetting', middlewares.verifySeller, SellerControllers.updateSecuritySetting)
router.get('/privacySetting', middlewares.verifySeller, SellerControllers.getPrivacySetting)
router.patch('/privacySetting', middlewares.verifySeller, SellerControllers.updatePrivacySetting)

// ----------------------------------------------- Business -----------------------------------------------------//

router.get('/Business', middlewares.verifySeller, SellerControllers.getBusiness)
router.post('/Business/:id', SellerControllers.addBusiness)
router.patch('/Business', middlewares.verifySeller, SellerControllers.updateBusiness)


// ----------------------------------------------- Shop -----------------------------------------------------//

router.get('/shop', middlewares.verifySeller, SellerControllers.getAllShop)
router.patch('/openShop', middlewares.verifySeller, SellerControllers.openAllShops)
router.patch('/openShop/:id', middlewares.verifySeller, SellerControllers.openShopByid)
router.get('/shop/:id', middlewares.verifySeller, SellerControllers.getShopById)
router.post('/shop', middlewares.verifySeller, SellerControllers.addShop)
router.patch('/shop/:id', middlewares.verifySeller, SellerControllers.updateShop)
router.delete('/shop/:id', middlewares.verifySeller, SellerControllers.deleteShop)

// ----------------------------------------------- Orders -----------------------------------------------------//

router.get('/order', middlewares.verifySeller, SellerControllers.getAllOrders)
router.get('/order/:id', middlewares.verifySeller, SellerControllers.getOrderById)
router.get('/orderbyStatus', middlewares.verifySeller, SellerControllers.getorderbyStatus)
router.patch('/orderStatus/:id', middlewares.verifySeller, SellerControllers.orderStatus)
router.get('/pastorder', middlewares.verifySeller, SellerControllers.getpastorder)
router.get('/ActiveOrder', middlewares.verifySeller, SellerControllers.getActiveOrder)

// ----------------------------------------------- Review -----------------------------------------------------//

router.get('/shopReview', middlewares.verifySeller, SellerControllers.getMyShopReviews)
router.get('/sellerReview', middlewares.verifySeller, SellerControllers.getSellerReviews)
router.get('/OrderReview', middlewares.verifySeller, SellerControllers.getOrderReviews)
router.post('/replyReview', middlewares.verifySeller, SellerControllers.replyToReview) // ...
router.patch('/editReply', middlewares.verifySeller, SellerControllers.editMyReplys) // ...



// ----------------------------------------------- invoice -----------------------------------------------------//

router.get('/invoice', middlewares.verifySeller, SellerControllers.getAllInvoice)
router.get('/invoice/:id', middlewares.verifySeller, SellerControllers.getAllInvoiceById)

// ----------------------------------------------- Notiification -----------------------------------------------------//

router.get('/Notifications', middlewares.verifySeller, SellerControllers.getAllMyNotifications)


module.exports = router 