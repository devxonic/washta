const express = require('express');
const router = express.Router();
const UserControllers = require('../controllers/Auth');
const middlewares = require('../middlewares');


router.post('/Signup' , UserControllers.signUp)
router.post('/login' , UserControllers.logIn)
router.post('/logOut' ,middlewares.verifyCustomer, UserControllers.logOut)

module.exports = router 