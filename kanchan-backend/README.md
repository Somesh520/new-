# Kanchan Management System - Backend API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

A comprehensive backend system for managing industrial equipment, customers, service operations, and team workflows. Built with Node.js, Express.js, and MongoDB.

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Application Flow](#application-flow)
- [Core Features](#core-features)
- [API Documentation](#api-documentation)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [File Upload System](#file-upload-system)
- [Email Notification System](#email-notification-system)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

The Kanchan Management System is a enterprise-grade backend application designed to streamline industrial equipment management, customer relations, and service operations. The system provides role-based access control, comprehensive tracking of machines and service records, task management, and automated notification systems.

### Key Stakeholders
- **Management**: Full system oversight and control
- **Service Head**: Service operations management
- **Engineers**: Field operations and technical tasks
- **Sales Team**: Customer relationship management
- **Commercial Team**: Business operations support

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   API Gateway   │    │   Database      │
│                 │    │                 │    │                 │
│ • Web App       │────│ • Authentication│────│ • MongoDB       │
│ • Mobile App    │    │ • Rate Limiting │    │ • Collections   │
│ • Admin Panel   │    │ • CORS          │    │ • Indexing      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │ Business Logic  │
                       │                 │
                       │ • Controllers   │
                       │ • Services      │
                       │ • Middleware    │
                       │ • Validation    │
                       └─────────────────┘
                                │
                  ┌─────────────────────────────┐
                  │     External Services       │
                  │                             │
                  │ • EmailJS (Notifications)   │
                  │ • Google OAuth             │
                  │ • Apple OAuth              │
                  │ • File Storage             │
                  └─────────────────────────────┘
```

## 🔄 Application Flow

### 1. User Authentication Flow
```
Registration/Login → JWT Token Generation → Role-Based Access → Dashboard
```

### 2. Customer Management Flow
```
Customer Creation → Machine Assignment → Service History → Ongoing Maintenance
```

### 3. Task Management Flow
```
Task Creation → Engineer Assignment → Progress Tracking → Completion → Reporting
```

### 4. Service Operations Flow
```
Service Request → Log Creation → Engineer Dispatch → Status Updates → Resolution
```

## ✨ Core Features

### 🔐 **Authentication & Authorization**
- **Multi-Provider Authentication**: Local, Google OAuth, Apple OAuth
- **Role-Based Access Control (RBAC)**: 4 distinct user roles with granular permissions
- **JWT Token Management**: Secure, stateless authentication
- **Session Security**: Token expiration and refresh mechanisms

### 👥 **User Management**
- **User Registration & Profile Management**
- **Role Assignment**: Sales, Commercial Team, Management, Engineer, Service Head
- **Profile Picture Upload**
- **User Activity Tracking**

### 🏢 **Customer Relationship Management**
- **Customer Profile Management**: Contact information, service history
- **Customer Search & Filtering**
- **Machine Association**: Link multiple machines to customers
- **Service History Tracking**

### 🔧 **Machine Management**
- **Machine Registration**: Model, serial number, specifications
- **Warranty Tracking**: Status, expiry dates, coverage details
- **Service Record Maintenance**: Complete maintenance history
- **Manual & Documentation Storage**: PDF, images, CAD files
- **Spare Parts Tracking**

### 📋 **Task Management System**
- **Task Creation & Assignment**: Multi-user task assignment
- **Progress Tracking**: To Do, In Progress, Completed
- **File Attachments**: Support for task-related documents
- **Due Date Management**: Deadline tracking and alerts
- **Task Ownership**: Clear responsibility assignment

### 🛠️ **Service Log Management**
- **Service Ticket Creation**: Detailed service request logging
- **Step-by-Step Tracking**: Service process workflow
- **Engineer Assignment**: Resource allocation
- **Status Management**: Open, Pending, Closed
- **Report Generation**: Service completion reports
- **Team Notifications**: Automated alerts and updates

### 📊 **Dashboard & Analytics**
- **Real-time Metrics**: Pending amounts, active requests, customers served
- **Quick Actions**: Fast customer and machine addition
- **Pending Tasks Overview**: Team workload visibility
- **Business Intelligence**: Performance metrics and trends

### 📁 **File Management System**
- **Multi-type File Support**: PDFs, images, documents
- **Secure Upload**: Validation and storage management
- **Organized Storage**: Category-based file organization
- **Access Control**: Role-based file access

### 📧 **Notification System**
- **EmailJS Integration**: Automated email notifications
- **Event-Driven Alerts**: Task assignments, service updates
- **Team Notifications**: Real-time communication
- **Escalation Management**: Priority-based alerting

## 📚 API Documentation

### Base URL
```
Production: https://api.kanchan-management.com
Development: http://localhost:5000
```

### API Structure
```
/api
├── /auth              # Authentication endpoints
├── /users             # User management
├── /customer          # Customer operations
├── /machine           # Machine management
├── /task              # Task management
├── /service-logs      # Service operations
├── /profile           # User profile management
└── /dashboard         # Dashboard and analytics
```

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "role": "Engineer"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "securePassword123"
}
```

#### Google OAuth
```http
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google_oauth_token"
}
```

### Customer Management Endpoints

#### Create Customer with Machine
```http
POST /api/customer
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "TechCorp Industries",
  "email": "contact@techcorp.com",
  "phone": "+1-555-0123",
  "address": "123 Industrial Park",
  "machine": {
    "model": "IndustrialMax 3000",
    "serial": "IM3K-2024-001",
    "warrantyExpiry": "2025-12-31",
    "warrantyStatus": "In warranty"
  }
}
```

#### Search Customers
```http
GET /api/customer/search?q=TechCorp
Authorization: Bearer {jwt_token}
```

### Machine Management Endpoints

#### Search Machine by Serial
```http
GET /api/machine/search?q=IM3K-2024
Authorization: Bearer {jwt_token}
```

#### Add Service Record
```http
POST /api/machine/{machine_id}/service-record
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "date": "2024-09-14",
  "summary": "Quarterly maintenance",
  "engineer": "engineer_user_id",
  "pendingPoints": ["Replace air filter"],
  "closedPoints": ["Lubricated moving parts"]
}
```

### Task Management Endpoints

#### Create Task
```http
POST /api/task
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Machine Calibration Required",
  "description": "Customer reported accuracy issues",
  "dueDate": "2024-09-20",
  "assignees": ["engineer_id_1", "engineer_id_2"],
  "status": "To do"
}
```

#### Get All Tasks
```http
GET /api/task?status=To do&date=2024-09-14
Authorization: Bearer {jwt_token}
```

### Dashboard Endpoints

#### Get Dashboard Summary
```http
GET /api/dashboard/summary
Authorization: Bearer {jwt_token}
```

#### Quick Add Customer
```http
POST /api/dashboard/add-customer
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Quick Customer",
  "email": "quick@customer.com",
  "phone": "+1-555-9999",
  "address": "Quick Address",
  "machine": {
    "model": "Quick Model",
    "serial": "QM-2024-999"
  }
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/krrish-singhal/kanchan-backend.git
cd kanchan-backend/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. **Start the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Development Setup

1. **Install development dependencies**
```bash
npm install --include=dev
```

2. **Run in development mode with hot reload**
```bash
npm run dev
```

3. **Database seeding (optional)**
```bash
node scripts/seed-database.js
```

## ⚙️ Environment Configuration

### Required Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/kanchan-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id

# Email Configuration (EmailJS)
EMAILJS_SERVICE_ID=your-emailjs-service-id
EMAILJS_TEMPLATE_ID=your-emailjs-template-id
EMAILJS_PUBLIC_KEY=your-emailjs-public-key
EMAILJS_PRIVATE_KEY=your-emailjs-private-key

# File Upload Configuration
MAX_FILE_SIZE=15728640  # 15MB
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Environment-Specific Configuration

#### Development
```env
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/kanchan-dev
DEBUG=kanchan:*
```

#### Production
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kanchan-prod
DEBUG=kanchan:error
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed),
  name: String,
  role: String (enum: ['Sales', 'Commercial Team', 'Management', 'Engineer', 'Service Head']),
  authProvider: String (enum: ['local', 'google', 'apple']),
  googleId: String,
  appleId: String,
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Customer Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String,
  phone: String,
  address: String,
  machines: [ObjectId] (ref: 'Machine'),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Machine Collection
```javascript
{
  _id: ObjectId,
  machineId: String (unique, auto-generated),
  model: String (required),
  serial: String (unique, required),
  customer: ObjectId (ref: 'Customer', required),
  warrantyExpiry: Date,
  warrantyCode: String,
  warrantyStatus: String (enum: ['In warranty', 'Out of warranty']),
  warrantyDetails: String,
  pendingDues: [{
    amount: Number,
    dueDate: Date
  }],
  serviceRecords: [{
    date: Date,
    summary: String,
    engineer: ObjectId (ref: 'User'),
    pendingPoints: [String],
    closedPoints: [String]
  }],
  manuals: [String],
  sparesUsed: [String],
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  status: String (enum: ['To do', 'In progress', 'Completed']),
  dueDate: Date,
  owner: ObjectId (ref: 'User', required),
  assignees: [ObjectId] (ref: 'User'),
  attachments: [String],
  kpis: [{
    key: String,
    value: String
  }],
  openPoints: [String],
  machineDetails: {
    customer: String,
    machineId: String,
    warrantyStatus: String
  },
  pendingAmounts: [Number],
  closedBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### ServiceLog Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  serviceId: String,
  status: String (enum: ['Open', 'Pending', 'Closed']),
  steps: [{
    label: String,
    status: String (enum: ['Pending', 'Completed']),
    completedAt: Date
  }],
  notes: String,
  history: [{
    timestamp: Date,
    user: ObjectId (ref: 'User'),
    note: String
  }],
  reportFile: String,
  options: {
    closeTicket: Boolean,
    notifyTeam: Boolean,
    urgent: Boolean
  },
  assignedEngineer: ObjectId (ref: 'User'),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Authorization

### Authentication Methods

1. **Local Authentication**
   - Email/password based
   - bcrypt hashing
   - JWT token generation

2. **Google OAuth 2.0**
   - Google Sign-In integration
   - Automatic user creation
   - Profile information sync

3. **Apple Sign-In**
   - Apple ID authentication
   - Privacy-focused login
   - Seamless iOS integration

### Role-Based Access Control (RBAC)

#### Permission Matrix

| Role | Tasks | Machines | Users | Customers | Service Logs |
|------|-------|----------|-------|-----------|--------------|
| **Sales** | View | View | View | View | View |
| **Commercial Team** | View | View | View | View | View |
| **Engineer** | View, Create, Update | View, Create, Update | View | View | View |
| **Management** | All | All | View, Create, Update | All | All |
| **Service Head** | All | All | All | All | All |

#### Access Control Implementation

```javascript
// Middleware example
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!hasPermission(userRole, resource, action)) {
      return res.status(403).json({
        message: 'Access denied',
        error: `Role '${userRole}' does not have '${action}' permission for '${resource}'`
      });
    }
    next();
  };
};
```

### JWT Token Structure

```javascript
{
  "id": "user_object_id",
  "email": "user@company.com",
  "role": "Engineer",
  "iat": 1631234567,
  "exp": 1631320967
}
```

## 📁 File Upload System

### Supported File Types

#### Machine Manuals
- **Formats**: PDF, JPEG, PNG, SVG, ZIP, BMP, GIF
- **Max Size**: 15MB
- **Storage**: `/uploads/manuals/`
- **Naming**: `{machineId}_{timestamp}.{ext}`

#### Service Reports
- **Formats**: PDF, JPEG, PNG
- **Max Size**: 10MB
- **Storage**: `/uploads/reports/`
- **Naming**: `{serviceLogId}_{timestamp}.{ext}`

#### Profile Pictures
- **Formats**: JPEG, PNG, GIF
- **Max Size**: 5MB
- **Storage**: `/uploads/profiles/`
- **Naming**: `{userId}_{timestamp}.{ext}`

#### Task Attachments
- **Formats**: All common file types
- **Max Size**: 10MB
- **Storage**: `/uploads/attachments/`
- **Naming**: `{taskId}_{timestamp}.{ext}`

### Upload Configuration

```javascript
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/manuals');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf', 'image/jpeg', 'image/png',
    'image/svg+xml', 'application/zip'
  ];
  cb(null, allowedTypes.includes(file.mimetype));
};
```

## 📧 Email Notification System

### EmailJS Integration

The system uses EmailJS for automated email notifications:

```javascript
const emailjs = require('emailjs-com');

async function sendEmail({ subject, to_email, message, user }) {
  const params = {
    subject: subject || 'Notification',
    to_email: to_email || 'admin@company.com',
    message: message || 'New notification',
    user_id: user || 'system',
    from_name: 'Kanchan Management System'
  };

  return await emailjs.send(
    SERVICE_ID, 
    TEMPLATE_ID, 
    params,
    {
      publicKey: PUBLIC_KEY,
      privateKey: PRIVATE_KEY
    }
  );
}
```

### Notification Events

1. **Task Notifications**
   - New task assignment
   - Task status updates
   - Due date reminders

2. **Service Log Notifications**
   - Service ticket creation
   - Status changes
   - Completion alerts

3. **System Notifications**
   - User registration
   - Password resets
   - System maintenance

## 🚨 Error Handling

### Error Response Format

```javascript
{
  "message": "Error description",
  "error": "Detailed error information",
  "status": 400,
  "timestamp": "2024-09-14T10:30:00Z",
  "path": "/api/customer"
}
```

### Error Categories

1. **Validation Errors (400)**
   - Invalid input data
   - Missing required fields
   - Format violations

2. **Authentication Errors (401)**
   - Invalid credentials
   - Expired tokens
   - Missing authentication

3. **Authorization Errors (403)**
   - Insufficient permissions
   - Role-based restrictions
   - Resource access denied

4. **Resource Errors (404)**
   - Entity not found
   - Invalid endpoints
   - Missing resources

5. **Server Errors (500)**
   - Database connection issues
   - Internal service failures
   - Unexpected exceptions

### Global Error Handler

```javascript
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.details
    });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      message: 'Authentication required',
      error: err.message
    });
  }

  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});
```

## 🧪 Testing

### Test Structure

```
tests/
├── unit/
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── integration/
│   ├── auth.test.js
│   ├── customer.test.js
│   └── machine.test.js
└── e2e/
    └── api.test.js
```

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

### Test Examples

#### Unit Test Example
```javascript
describe('Customer Controller', () => {
  test('should create customer with machine', async () => {
    const mockCustomer = {
      name: 'Test Customer',
      email: 'test@test.com',
      machine: { model: 'Test Model', serial: 'TEST-001' }
    };

    const result = await customerController.addCustomerWithMachine(mockReq, mockRes);
    expect(result.status).toBe(201);
    expect(result.customer.name).toBe('Test Customer');
  });
});
```

#### Integration Test Example
```javascript
describe('Authentication API', () => {
  test('POST /api/auth/login should return JWT token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@test.com');
  });
});
```

## 🚀 Deployment

### Production Deployment

#### Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

2. **Build and run**
```bash
docker build -t kanchan-backend .
docker run -p 5000:5000 --env-file .env kanchan-backend
```

#### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monitor
```

#### ecosystem.config.js
```javascript
module.exports = {
  apps: [{
    name: 'kanchan-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

### Environment Setup

#### Staging Environment
```bash
# Install dependencies
npm ci

# Run database migrations
npm run migrate

# Start application
npm start
```

#### Production Environment
```bash
# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
```

## 📊 Monitoring & Logging

### Application Monitoring

1. **Health Check Endpoint**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

2. **Request Logging**
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});
```

### Performance Metrics

- **Response Time**: Average API response time
- **Request Rate**: Requests per minute
- **Error Rate**: Failed requests percentage
- **Database Performance**: Query execution time
- **Memory Usage**: Application memory consumption
- **CPU Usage**: Server resource utilization

## 🔧 Maintenance

### Database Maintenance

#### Backup Strategy
```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/kanchan-management" --out="/backup/$(date +%Y%m%d)"

# Restore backup
mongorestore --uri="mongodb://localhost:27017/kanchan-management" /backup/20240914
```

#### Index Optimization
```javascript
// Customer search optimization
db.customers.createIndex({ "name": "text", "email": "text", "phone": "text" });

// Machine search optimization
db.machines.createIndex({ "serial": 1, "model": 1 });

// Task filtering optimization
db.tasks.createIndex({ "status": 1, "dueDate": 1, "assignees": 1 });
```

### Security Updates

1. **Regular dependency updates**
```bash
npm audit
npm update
```

2. **Security scanning**
```bash
npm audit fix
```

3. **Environment variable rotation**
   - JWT secrets
   - Database credentials
   - API keys

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
```bash
git checkout -b feature/new-feature
```

3. **Make changes and test**
```bash
npm test
npm run lint
```

4. **Commit changes**
```bash
git commit -m "feat: add new feature"
```

5. **Push and create PR**
```bash
git push origin feature/new-feature
```

### Code Style Guidelines

- **ESLint**: Follow configured linting rules
- **Prettier**: Automatic code formatting
- **Naming Conventions**: camelCase for variables, PascalCase for classes
- **Comment Standards**: JSDoc for functions and classes

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:
```
feat(auth): add Google OAuth integration

Implement Google Sign-In functionality with automatic user creation
and profile synchronization.

Closes #123
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- **Email**: support@kanchan-management.com
- **Documentation**: [Wiki](https://github.com/krrish-singhal/kanchan-backend/wiki)
- **Issues**: [GitHub Issues](https://github.com/krrish-singhal/kanchan-backend/issues)

## 🚀 Roadmap

### Upcoming Features

- [ ] **Real-time Notifications**: WebSocket integration
- [ ] **Advanced Analytics**: Business intelligence dashboard
- [ ] **Mobile App Support**: Enhanced mobile API endpoints
- [ ] **Audit Logging**: Comprehensive activity tracking
- [ ] **Data Export**: CSV/Excel export functionality
- [ ] **API Rate Limiting**: Enhanced security measures
- [ ] **Caching Layer**: Redis integration for performance
- [ ] **Message Queue**: Asynchronous task processing

### Performance Improvements

- [ ] **Database Optimization**: Query performance enhancement
- [ ] **CDN Integration**: Static file delivery optimization
- [ ] **Load Balancing**: Multi-instance deployment support
- [ ] **Monitoring Dashboard**: Real-time system metrics

---

## 📋 Quick Reference

### Development Commands
```bash
npm run dev          # Start development server
npm test            # Run tests
npm run lint        # Check code style
npm run build       # Build for production
```

### API Base URLs
```
Development: http://localhost:5000
Production:  https://api.kanchan-management.com
```

### Key Dependencies
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **multer**: File upload handling
- **joi**: Input validation
- **cors**: Cross-origin resource sharing

---

**Built with ❤️ by the Kanchan Development Team**