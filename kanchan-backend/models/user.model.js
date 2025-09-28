const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    name: { type: String }, 
    role: { 
        type: String, 
        enum: ['Sales', 'Commercial Team', 'Management', 'Engineer', 'Service Head'], 
        required: true 
    },
    authProvider: { 
        type: String, 
        enum: ['local', 'google', 'apple'], 
        default: 'local' 
    },
    googleId: { type: String }, // For Google OAuth
    appleId: { type: String },  // For Apple OAuth
    profilePicture: { type: String, default: null } // URL or path to uploaded picture
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);
