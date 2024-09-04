const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Auth');
const agentController = require('../controllers/agent');
const middlewares = require('../middlewares');


// ----------------------------------------------- Auth -----------------------------------------------------//

router.post('/Signup', middlewares.verifyAdmin, AuthController.AgentSignUp)
router.post('/login', AuthController.AgentlogIn)

// ----------------------------------------------- help/support -----------------------------------------------------//

// router.post('/support', middlewares.verifyCustomer, CustomerControllers.craeteNewSupportRoom)
router.get('/support', middlewares.verifyAgent, agentController.getSupportRoom)
router.get('/support/:id', middlewares.verifyAgent, agentController.getSupportRoom)
router.patch('/support/:id', middlewares.verifyAgent, agentController.acceptSupportRequest)


module.exports = router 