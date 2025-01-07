const express = require('express');
const router = express.Router();

// Route handler for /greet endpoint
router.get('/greet', (req, res) => {
    res.json({ message: 'Hello Michael' });
});

module.exports = router;
