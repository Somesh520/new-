const User = require('../models/user.model');

// Get all users (for testing/admin purposes)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 });
        res.json({ 
            message: 'Users retrieved successfully',
            count: users.length,
            users 
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, 'name email role createdAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};
