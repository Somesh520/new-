const express = require('express');
const { createTask, getTasks, updateTask, uploadAttachment, deleteTask, getTaskById } = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');
const { checkPermission, viewOnlyRoles } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

// All routes require authentication
router.use(auth);

// GET routes - All roles can view
router.get('/', checkPermission('tasks', 'view'), getTasks);
router.get('/:id', checkPermission('tasks', 'view'), getTaskById);

// POST routes - Restricted roles
router.post('/', checkPermission('tasks', 'create'), createTask);
router.post('/:id/attachment', checkPermission('tasks', 'update'), upload.single('attachment'), uploadAttachment);

// PATCH routes - Restricted roles  
router.patch('/:id', checkPermission('tasks', 'update'), updateTask);

// DELETE routes - Only Management and Service Head
router.delete('/:id', checkPermission('tasks', 'delete'), deleteTask);

module.exports = router;
