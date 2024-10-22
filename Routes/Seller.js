const express = require('express');
const router = express.Router();
const SellerControllers = require('../controllers/Seller');
const middlewares = require('../middlewares');

// ----------------------------------------------- Profile -----------------------------------------------------//

router.get('/Profile', middlewares.verifySeller, SellerControllers.getProfile)
router.patch('/Profile', middlewares.verifySeller, SellerControllers.editProfile)
router.post('/uplaodAvatar', middlewares.verifySeller, middlewares.uploadbuffer.single('Avatar'), SellerControllers.uplaodAvatar)
router.patch('/updatePassword', middlewares.verifySeller, SellerControllers.updatePassword)
router.get('/bankAccount', middlewares.verifySeller, SellerControllers.getbankAccount)
router.post('/bankAccount', middlewares.verifySeller, SellerControllers.updatebankAccount)

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
router.get('/latestOrders', middlewares.verifySeller, SellerControllers.getLatestOrders)

// ----------------------------------------------- Review -----------------------------------------------------//

router.get('/myReview', middlewares.verifySeller, SellerControllers.getMyReviews)
router.get('/shopReview', middlewares.verifySeller, SellerControllers.getMyShopReviews)
router.get('/sellerReview', middlewares.verifySeller, SellerControllers.getSellerReviews)
router.get('/OrderReview', middlewares.verifySeller, SellerControllers.getOrderReviews)
router.post('/replyReview', middlewares.verifySeller, SellerControllers.replyToReview) // ...
router.delete('/deleteReply', middlewares.verifySeller, SellerControllers.deleteMyReplys) // ...
router.patch('/editReply', middlewares.verifySeller, SellerControllers.editMyReplys) // ...



// ----------------------------------------------- invoice -----------------------------------------------------//

router.get('/invoice', middlewares.verifySeller, SellerControllers.getAllInvoice)
router.get('/invoice/:id', middlewares.verifySeller, SellerControllers.getAllInvoiceById)

// ----------------------------------------------- Notiification -----------------------------------------------------//

router.get('/Notifications', middlewares.verifySeller, SellerControllers.getAllMyNotifications)

// ----------------------------------------------- stats -----------------------------------------------------//

router.get('/stats', middlewares.verifySeller, SellerControllers.getAllTimeStats)
router.get('/monthStats', middlewares.verifySeller, SellerControllers.getstatsbyMonth)
router.get('/weekStats', middlewares.verifySeller, SellerControllers.getStatsByWeek)

// ----------------------------------------------- help/support -----------------------------------------------------//

router.post('/support', middlewares.verifySeller, SellerControllers.craeteNewSupportRoom)
router.get('/support', middlewares.verifySeller, SellerControllers.getSupportRoom)
router.get('/support/:id', middlewares.verifySeller, SellerControllers.getSupportRoom)

// ----------------------------------------------- agent Reviews -----------------------------------------------------//

router.post('/agentReview', middlewares.verifySeller, SellerControllers.createAgentReview)
router.patch('/agentReview', middlewares.verifySeller, SellerControllers.updatesAgentReview)
router.get('/agentReview', middlewares.verifySeller, SellerControllers.getAgentReview)
router.delete('/agentReview', middlewares.verifySeller, SellerControllers.deleteAgentReviews)





module.exports = router 