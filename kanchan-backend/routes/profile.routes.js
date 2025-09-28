const express = require('express');
const multer = require('multer');
const { getProfile, updateProfile, uploadProfilePicture, logout } = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// All routes need authentication
router.use(authMiddleware);

// Get user profile
router.get('/', getProfile);

// Update user profile
router.put('/', updateProfile);

// Upload profile picture
router.post('/upload-picture', (req, res, next) => {
    console.log('Upload route hit');
    console.log('Request headers:', req.headers);
    
    upload.single('profilePicture')(req, res, (err) => {
        console.log('Multer processing complete');
        console.log('Error:', err);
        console.log('File:', req.file);
        console.log('Body:', req.body);
        
        if (err instanceof multer.MulterError) {
            console.log('MulterError occurred:', err.code);
            if (err.code === 'UNEXPECTED_FIELD') {
                return res.status(400).json({ 
                    message: 'Unexpected field name', 
                    error: 'Please use field name "profilePicture" for file upload',
                    expectedField: 'profilePicture'
                });
            }
            return res.status(400).json({ message: 'File upload error', error: err.message });
        } else if (err) {
            return res.status(400).json({ message: 'Upload error', error: err.message });
        }
        next();
    });
}, uploadProfilePicture);

// Logout
router.post('/logout', logout);

module.exports = router;
