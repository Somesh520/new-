const express = require('express');
const customerController = require('../controllers/customer.controller');
const auth = require('../middleware/auth.middleware');
const { rbac } = require('../middleware/role.middleware');
const router = express.Router();

router.use(auth);

// Management/Service Head protected add/edit/delete
router.post('/', rbac(['Management', 'Service Head']), customerController.addCustomerWithMachine);
router.put('/:id', rbac(['Management', 'Service Head']), customerController.updateCustomer);
router.delete('/:id', rbac(['Management', 'Service Head']), customerController.deleteCustomer);

// All users: search/view
router.get('/search', customerController.searchCustomers);
router.get('/:id', customerController.getCustomerProfile);

module.exports = router;
