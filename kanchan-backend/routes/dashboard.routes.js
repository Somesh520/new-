const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

router.use(auth);

router.get('/summary', dashboardController.getDashboardSummary);
router.post('/add-customer', dashboardController.addCustomer);      // "Go" on Add New Customer
router.post('/add-machine', dashboardController.addMachine);        // "Go" on Add Machine
router.get('/pending-tasks', dashboardController.getPendingTasks);  // "Go" on View Pending Tasks

module.exports = router;
