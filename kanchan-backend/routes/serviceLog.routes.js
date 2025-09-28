const express = require('express');
const controller = require('../controllers/serviceLog.controller');
const auth = require('../middleware/auth.middleware');
const { checkPermission, viewOnlyRoles } = require('../middleware/role.middleware');
const upload = require('../middleware/uploadReport.middleware');
const router = express.Router();

router.use(auth);

// View-only roles restriction middleware
router.use(viewOnlyRoles);

// Service Logs Management
router.post('/', checkPermission('tasks','create'), controller.createLog);                  // Create service log
router.get('/', controller.listLogs);                                                      // List logs
router.get('/:id', controller.getLog);                                                     // Get log by ID
router.put('/:id', checkPermission('tasks','update'), controller.updateLog);               // Update log
router.delete('/:id', checkPermission('tasks','delete'), controller.deleteLog);            // Delete log

// Service Steps/Timeline
router.put('/:id/steps', checkPermission('tasks','update'), controller.updateSteps);

// Service History
router.post('/:id/history', checkPermission('tasks','update'), controller.addHistoryEntry);
router.get('/:id/history', controller.getHistory);

// Report Upload
router.post('/:id/upload', checkPermission('tasks','update'), upload.single('report'), controller.uploadReport);

// Ticket & Notifications
router.put('/:id/close', checkPermission('tasks','update'), controller.closeLog);
router.post('/:id/notify', checkPermission('tasks','view'), controller.notifyTeam);

module.exports = router;
