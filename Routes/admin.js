const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Auth');
const AdminController = require('../controllers/admin');
const middlewares = require('../middlewares');


// ----------------------------------------------- Auth -----------------------------------------------------//

router.post('/Signup', AuthController.AdminSignUp)
router.post('/login', AuthController.AdminlogIn)
// router.post('/logOut' , AuthController.logOut)

// ----------------------------------------------- Auth -----------------------------------------------------//

router.get('/businessBystatus', AdminController.getBusinessbyStatus)
router.patch('/businessUpdateStatus/:id' , AdminController.updateStatus)
router.patch('/businessApprove/:id' , AdminController.businessApprove)
router.patch('/businessTerminate/:id' , AdminController.businessTerminate)


module.exports = router 