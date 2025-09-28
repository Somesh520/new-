const express = require('express');
const { getAllUsers, getUserById } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes need authentication
router.use(authMiddleware);

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

module.exports = router;
