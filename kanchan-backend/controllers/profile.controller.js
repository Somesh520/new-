const User = require('../models/user.model');
const fs = require('fs-extra');
const path = require('path');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        // Check if req.body exists and has data
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: 'Request body is empty or invalid',
                hint: 'Please ensure you are sending JSON data with Content-Type: application/json header'
            });
        }

        const { name, email, role } = req.body;
        const userId = req.user.id;

        // Validate that at least one field is provided for update
        if (!name && !email && !role) {
            return res.status(400).json({ 
                message: 'No fields provided for update',
                hint: 'Please provide at least one field: name, email, or role'
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        // Update fields if provided
        if (name !== undefined) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();

        // Return user without password
        const updatedUser = await User.findById(userId).select('-password');
        res.json({ 
            message: 'Profile updated successfully', 
            user: updatedUser 
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profile picture if exists
        if (user.profilePicture) {
            const oldImagePath = path.join(__dirname, '..', user.profilePicture);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update user profile picture path
        const imageUrl = `/uploads/profiles/${req.file.filename}`;
        user.profilePicture = imageUrl;
        await user.save();

        res.json({ 
            message: 'Profile picture uploaded successfully',
            profilePicture: imageUrl,
            user: await User.findById(userId).select('-password')
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Logout (JWT is stateless, so this is mainly for frontend)
exports.logout = async (req, res) => {
    res.json({ 
        message: 'Logged out successfully',
        // In a real app, you might want to blacklist the token
    });
};
