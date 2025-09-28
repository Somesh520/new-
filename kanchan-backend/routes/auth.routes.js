const express = require('express');
const { register, login } = require('../controllers/auth.controllers');
const { validate } = require('../utils/validate');
const { registerSchema, loginSchema } = require('../schemas/auth.schemas');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

module.exports = router;
