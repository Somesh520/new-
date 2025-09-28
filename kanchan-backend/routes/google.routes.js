const express = require('express');
const { googleAuth } = require('../controllers/googleAuth.contoller');
const router = express.Router();

router.post('/google', googleAuth);

module.exports = router;
