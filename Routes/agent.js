const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Auth');
const middlewares = require('../middlewares');


// ----------------------------------------------- Auth -----------------------------------------------------//

router.post('/Signup', middlewares.verifyAdmin ,  AuthController.AgentSignUp)
router.post('/login', AuthController.AgentlogIn)


module.exports = router 