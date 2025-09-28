const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().allow('', null), // Name is optional, can be empty
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match'
    }),
    role: Joi.string().valid('Sales', 'Commercial Team', 'Management', 'Engineer', 'Service Head').required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().required()
});

exports.register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email: email.trim() });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ 
            name: name || '', // Set name if provided
            email: email.trim(), 
            password: hash, 
            role,
            authProvider: 'local'
        });
        await user.save();

        // Optionally generate JWT on registration or just return user info
        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                authProvider: user.authProvider
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    console.log("Login request body:");
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;
        const user = await User.findOne({ email: email.trim() });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if user is OAuth user (no password)
        if (user.authProvider !== 'local' || !user.password) {
            return res.status(400).json({ message: 'Please login with your social account' });
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
