/**
  * Controller for handling greeting related endpoints
  */

// Create router
const express = require('express');
const router = express.Router();

/**
  * GET /api/greet
  * Returns a greeting message
  */
router.get('/', (req, res) => {
  const name = req.query.name || 'Guest';
  res.json({
    message: `Hello, ${name}!`
  });
});

module.exports = router;
