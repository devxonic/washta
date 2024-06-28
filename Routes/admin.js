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
router.patch('/businessUpdateStatus/:id', middlewares.verifyAdmin, AdminController.updateStatus)
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

// ----------------------------------------------- Customer  -----------------------------------------------------//

router.get('/customer', middlewares.verifyAdmin, AdminController.getCustomer)
router.get('/customer/:id', middlewares.verifyAdmin, AdminController.getCustomerByid)
router.patch('/customer/:id', middlewares.verifyAdmin, AdminController.updateCustomer)

// ----------------------------------------------- Customer  -----------------------------------------------------//

router.get('/vehicles', middlewares.verifyAdmin, AdminController.getVehicles)
router.get('/vehicles/:id', middlewares.verifyAdmin, AdminController.getvehiclesById)
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


module.exports = router 