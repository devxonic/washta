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

router.get('/businessBystatus', AdminController.getBusinessbyStatus)
router.patch('/businessUpdateStatus/:id' , AdminController.updateStatus)
router.patch('/businessApprove/:id' , AdminController.businessApprove)
router.patch('/businessTerminate/:id' , AdminController.businessTerminate)

// ----------------------------------------------- Job History -----------------------------------------------------//

router.get('/JobHistory', AdminController.JobHistory)
// router.patch('/businessUpdateStatus/:id' , AdminController.updateStatus)
// router.patch('/businessApprove/:id' , AdminController.businessApprove)
// router.patch('/businessTerminate/:id' , AdminController.businessTerminate)


// ----------------------------------------------- Top comp / Cust  -----------------------------------------------------//

router.get('/TopCustomers', AdminController.getTopCustomer)
router.get('/TopCustomers', AdminController.getTopCompanies)

module.exports = router 