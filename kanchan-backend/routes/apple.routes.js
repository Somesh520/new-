const express = require('express');
const { appleAuth } = require('../controllers/appleAuth.controller');
const router = express.Router();

router.post('/apple', appleAuth);

module.exports = router;
