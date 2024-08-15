const express = require('express');
const router = express.Router();
const subsControllers = require('../controllers/subscription');
const middlewares = require('../middlewares');

router.post('/', subsControllers.subscibe)
router.get('/', middlewares.verifyAdmin, subsControllers.getAllSubscibers)
router.get('/:id', middlewares.verifyAdmin, subsControllers.getSubscibersById)

module.exports = router 