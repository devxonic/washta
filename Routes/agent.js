const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/Auth');
const agentController = require('../controllers/agent');
const middlewares = require('../middlewares');


// ----------------------------------------------- Auth -----------------------------------------------------//

router.post('/Signup', middlewares.verifyAdmin, AuthController.AgentSignUp)
router.post('/login', AuthController.AgentlogIn)
// ----------------------------------------------- profile -----------------------------------------------------//
router.get('/profile', middlewares.verifyAgent, AuthController.getProfile)
router.patch('/profile', middlewares.verifyAgent, AuthController.updateProfile)

// ----------------------------------------------- help/support -----------------------------------------------------//

// router.post('/support', middlewares.verifyCustomer, CustomerControllers.craeteNewSupportRoom)
router.get('/support', middlewares.verifyAgent, agentController.getSupportRoom)
router.get('/support/:id', middlewares.verifyAgent, agentController.getSupportRoom)
router.patch('/support/:id', middlewares.verifyAgent, agentController.acceptSupportRequest)
router.patch('/endChat/:id', middlewares.verifyAgent, agentController.endChat) // ...
router.get('/chat', middlewares.verifyAgent, agentController.getAllchats) // ...


// ----------------------------------------------- Review -----------------------------------------------------//

router.get('/agentReview', middlewares.verifyAgent, agentController.getAgentReviews)
router.post('/replyReview', middlewares.verifyAgent, agentController.replyToReview) // ...
// router.delete('/deleteReply', middlewares.verifyAgent, agentController.deleteMyReplys) // ...
router.patch('/editReply', middlewares.verifyAgent, agentController.editMyReplys) // ...



module.exports = router 