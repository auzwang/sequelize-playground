const express = require('express');
const router = express.Router();
const greetingController = require('../controllers/greetingController');

// Mount the greeting controller routes
router.use('/greet', greetingController);

module.exports = router;
