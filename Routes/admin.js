const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Auth');
const AdminController = require('../controllers/admin');
const middlewares = require('../middlewares');


// ----------------------------------------------- Auth -----------------------------------------------------//

router.post('/Signup', AuthController.AdminSignUp)
router.post('/login', AuthController.AdminlogIn)
// router.post('/logOut' , AuthController.logOut)

// ----------------------------------------------- Business -----------------------------------------------------//

router.get('/businessBystatus', middlewares.verifyAdmin, AdminController.getBusinessbyStatus)
router.get('/business', middlewares.verifyAdmin, AdminController.getAllBusniess)
router.get('/business/:id', middlewares.verifyAdmin, AdminController.getBusinessById)
router.patch('/businessReject/:id', middlewares.verifyAdmin, AdminController.businessReject)
router.patch('/businessApprove/:id', middlewares.verifyAdmin, AdminController.businessApprove)
router.patch('/businessTerminate/:id', middlewares.verifyAdmin, AdminController.businessTerminate)

// ----------------------------------------------- Job History -----------------------------------------------------//

router.get('/JobHistory', middlewares.verifyAdmin, AdminController.JobHistory)

// ----------------------------------------------- Top comp / Cust  -----------------------------------------------------//

// router.get('/TopCustomers', AdminController.getTopCustomer)
// router.get('/TopCustomers', AdminController.getTopCompanies)

// ----------------------------------------------- Shop  -----------------------------------------------------//

router.get('/shop', middlewares.verifyAdmin, AdminController.getShop)
router.get('/shop/:id', middlewares.verifyAdmin, AdminController.getShopbyid)
router.patch('/shop/:id', middlewares.verifyAdmin, AdminController.UpdateShopbyAmdin)
router.patch('/shop', middlewares.verifyAdmin, AdminController.updateShopTiming)
router.delete('/shop/:id', middlewares.verifyAdmin, AdminController.terminateShop)

// ----------------------------------------------- Customer  -----------------------------------------------------//

router.get('/customer', middlewares.verifyAdmin, AdminController.getCustomer)
router.get('/customer/:id', middlewares.verifyAdmin, AdminController.getCustomerByid)
router.patch('/customer/:id', middlewares.verifyAdmin, AdminController.updateCustomer)
router.delete('/customer/:id', middlewares.verifyAdmin, AdminController.terminateCustomer)
router.delete('/bookings', middlewares.verifyAdmin, AdminController.deleteOrderByCustomerId)

// ----------------------------------------------- Customer  -----------------------------------------------------//

router.get('/vehicles', middlewares.verifyAdmin, AdminController.getVehicles)
router.get('/vehicles/:id', middlewares.verifyAdmin, AdminController.getvehiclesById)
router.get('/vehiclesByCustomer', middlewares.verifyAdmin, AdminController.getVehiclesByCustomerId)
router.patch('/vehicles/:id', middlewares.verifyAdmin, AdminController.updateVehicles)

// ----------------------------------------------- Service fee  -----------------------------------------------------//

router.post('/serviceFee', middlewares.verifyAdmin, AdminController.createServiceFee)
router.get('/serviceFee', middlewares.verifyAdmin, AdminController.getserviceFee)
router.get('/serviceFee/:id', middlewares.verifyAdmin, AdminController.getserviceFeeById)
router.patch('/serviceFee/:id', middlewares.verifyAdmin, AdminController.updateServiceFee)

// ----------------------------------------------- Promo Code  -----------------------------------------------------//

router.post('/promoCode', middlewares.verifyAdmin, AdminController.createPromoCode)
router.get('/promoCode', middlewares.verifyAdmin, AdminController.getPromoCode)
router.get('/promoCode/:id', middlewares.verifyAdmin, AdminController.getPromoCodeById)
router.patch('/promoCode/:id', middlewares.verifyAdmin, AdminController.updatePromoCode)


// ----------------------------------------------- Review -----------------------------------------------------//

router.get('/shopReview', middlewares.verifySeller, AdminController.getShopReviews)
router.get('/sellerReview', middlewares.verifySeller, AdminController.getSellerReviews)
router.get('/orderReview', middlewares.verifySeller, AdminController.getOrderReviews)
router.get('/customerReview', middlewares.verifySeller, AdminController.getCustomerReviews)
router.post('/replyReview', middlewares.verifySeller, AdminController.replyToReview) // ...
router.patch('/editReply', middlewares.verifySeller, AdminController.editMyReplys) // ...
router.delete('/deleteReview', middlewares.verifySeller, AdminController.deleteReviews) // ...



module.exports = router 