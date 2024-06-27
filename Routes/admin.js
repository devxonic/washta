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
// router.patch('/businessUpdateStatus/:id' , AdminController.updateStatus)
// router.patch('/businessApprove/:id' , AdminController.businessApprove)
// router.patch('/businessTerminate/:id' , AdminController.businessTerminate)


// ----------------------------------------------- Top comp / Cust  -----------------------------------------------------//

// router.get('/TopCustomers', AdminController.getTopCustomer)
// router.get('/TopCustomers', AdminController.getTopCompanies)

// ----------------------------------------------- Shop  -----------------------------------------------------//

router.get('/shop', middlewares.verifyAdmin, AdminController.getShop)
router.get('/shop/:id', middlewares.verifyAdmin, AdminController.getShopbyid)
router.patch('/shop/:id', middlewares.verifyAdmin, AdminController.UpdateShopbyAmdin)



module.exports = router 