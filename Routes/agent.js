const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Auth');
// const AgentController = require('../controllers/agent');
const middlewares = require('../middlewares');


// ----------------------------------------------- Auth -----------------------------------------------------//

router.post('/Signup', middlewares.verifyAdmin, AuthController.AgentSignUp)
router.post('/login', AuthController.AgentLogin)
// router.post('/logOut' , AuthController.logOut)




module.exports = router 