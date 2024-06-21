const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Auth');
const middlewares = require('../middlewares');


// ----------------------------------------------- Auth -----------------------------------------------------//

router.post('/Signup' , AuthController.AdminSignUp)
router.post('/login' , AuthController.AdminlogIn)
// router.post('/logOut' , AuthController.logOut)

module.exports = router 