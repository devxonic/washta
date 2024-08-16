const express = require('express');
const router = express.Router();
const CustomerControllers = require('../controllers/Customer');
const middlewares = require('../middlewares');


router.post('/uplaodAvatar', middlewares.verifyCustomer , middlewares.uploadbuffer.single('Avatar'), CustomerControllers.uplaodAvatar)
router.get('/Profile', middlewares.verifyCustomer, CustomerControllers.getProfile)
router.patch('/Profile', middlewares.verifyCustomer, CustomerControllers.editProfile)
router.patch('/updatePassword', middlewares.verifyCustomer, CustomerControllers.updatePassword)
router.get('/notificationSetting', middlewares.verifyCustomer, CustomerControllers.getNotificationSetting)
router.patch('/notificationSetting', middlewares.verifyCustomer, CustomerControllers.updateNotificationSetting)
router.get('/securitySetting', middlewares.verifyCustomer, CustomerControllers.getSecuritySetting)
router.patch('/securitySetting', middlewares.verifyCustomer, CustomerControllers.updateSecuritySetting)
router.get('/privacySetting', middlewares.verifyCustomer, CustomerControllers.getPrivacySetting)
router.patch('/privacySetting', middlewares.verifyCustomer, CustomerControllers.updatePrivacySetting)

// ----------------------------------------------- vehicle -----------------------------------------------------//

router.get('/vehicle', middlewares.verifyCustomer, CustomerControllers.getVehicles)
router.post('/vehicle', middlewares.verifyCustomer, CustomerControllers.addVehicles)
router.patch('/vehicle/:id', middlewares.verifyCustomer, CustomerControllers.updateVehicles)
router.delete('/vehicle/:id', middlewares.verifyCustomer, CustomerControllers.DeleteVehicle)
router.get('/Selectcar', middlewares.verifyCustomer, CustomerControllers.getIsSelected)
router.patch('/Selectcar', middlewares.verifyCustomer, CustomerControllers.updateIsSelected)

// ----------------------------------------------- Shop -----------------------------------------------------//

router.get('/Shop', middlewares.verifyCustomer, CustomerControllers.getAllShops)
router.get('/NearShop', middlewares.verifyCustomer, CustomerControllers.getShopByLocation)
router.get('/Shop/:id', middlewares.verifyCustomer, CustomerControllers.getShopById)


// ----------------------------------------------- booking -----------------------------------------------------//


router.get('/booking', middlewares.verifyCustomer, CustomerControllers.getMyBookings)
router.get('/booking/:id', middlewares.verifyCustomer, CustomerControllers.getMyBookingById)
router.patch('/booking/:id', middlewares.verifyCustomer, CustomerControllers.cancelBooking)
router.post('/booking', middlewares.verifyCustomer, CustomerControllers.createNewBooking)
router.get('/bookingbyStatus', middlewares.verifyCustomer, CustomerControllers.getbookingbyStatus)

// ----------------------------------------------- incoive -----------------------------------------------------//


router.get('/invoice', middlewares.verifyCustomer, CustomerControllers.getAllInvoice)
router.get('/invoice/:id', middlewares.verifyCustomer, CustomerControllers.getInvoiceById)

// ----------------------------------------------- shop Reviews -----------------------------------------------------//


router.post('/shopReview', middlewares.verifyCustomer, CustomerControllers.createShopRating)
router.patch('/shopReview', middlewares.verifyCustomer, CustomerControllers.updatesShopReview)
router.get('/myReview', middlewares.verifyCustomer, CustomerControllers.getMyReviews)
router.get('/shopReview', middlewares.verifyCustomer, CustomerControllers.getShopReviews)
router.delete('/shopReview', middlewares.verifyCustomer, CustomerControllers.deleteShopReviews)

// ----------------------------------------------- seller Reviews -----------------------------------------------------//

router.post('/sellerReview', middlewares.verifyCustomer, CustomerControllers.createSellerReview)
router.patch('/sellerReview', middlewares.verifyCustomer, CustomerControllers.updatesSellerReview)
router.get('/sellerReview', middlewares.verifyCustomer, CustomerControllers.getSellerReview)
router.delete('/sellerReview', middlewares.verifyCustomer, CustomerControllers.deleteShopReviews)




module.exports = router 