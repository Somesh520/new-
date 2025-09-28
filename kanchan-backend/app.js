const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import models to ensure they are registered
require('./models/user.model');
require('./models/customer.model');
require('./models/machine.model');
require('./models/task.model');
require('./models/serviceLog.model');

// Import routes
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const googleRoutes = require('./routes/google.routes');
const appleRoutes = require('./routes/apple.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const machineRoutes = require('./routes/machine.routes');
const customerRoutes = require('./routes/customer.routes');
const serviceLogRoutes = require('./routes/serviceLog.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

dotenv.config();

const app = express();

app.use(cors());
// Increase limits to support file uploads and large payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug logging middleware for development
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.method !== 'GET') {
        console.log('Body:', req.body);
    }
    next();
});

// Error handling for JSON parsing problems
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON format in request body',
            error: 'Check your JSON syntax (double quotes, no trailing commas, etc.)'
        });
    }
    next();
});

// Serve static files (profile pictures, task attachments, etc)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount all API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/auth', googleRoutes);
app.use('/api/auth', appleRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/machine', machineRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/service-logs', serviceLogRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Connect to MongoDB with improved error handling
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => {
    console.log('MongoDB connected');

})
.catch((err) => {
    console.error('MongoDB connection error:');
    
    process.exit(1);
});

module.exports = app;
