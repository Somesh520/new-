const express = require('express');
const machineController = require('../controllers/machine.controller');
const auth = require('../middleware/auth.middleware');
const { rbac } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

router.use(auth);

// Search by serial (all roles)
router.get('/search', machineController.searchBySerial);

// Get full machine history/details (all roles)
router.get('/:id', machineController.getMachineHistory);

// Add manual (Management, Service Head, Engineer only)
router.post('/:id/manual', rbac(['Management','Service Head','Engineer']), upload.single('manual'), machineController.uploadManual);

// Add service record (Management, Service Head, Engineer only)
router.post('/:id/service-record', rbac(['Management','Service Head','Engineer']), machineController.addServiceRecord);

// Update warranty (Management, Service Head, Engineer only)
router.put('/:id/warranty', rbac(['Management','Service Head','Engineer']), machineController.updateWarranty);

// View all history (all roles)
router.get('/:id/history', machineController.viewHistory);

module.exports = router;
