const Task = require('../models/task.model');
const Customer = require('../models/customer.model');
const Machine = require('../models/machine.model');

// --- Dashboard Summary ---
exports.getDashboardSummary = async (req, res) => {
    try {
        const tasksWithPending = await Task.find({ pendingAmounts: { $exists: true, $ne: [] } });
        const pendingAmounts = tasksWithPending.reduce((sum, t) => sum + (t.pendingAmounts?.reduce((a, v) => a + v, 0) || 0), 0);
        const activeRequests = await Task.countDocuments({ status: { $in: ['To do', 'In progress'] } });
        const customersServed = await Customer.countDocuments();

        return res.json({
            pendingAmounts,
            activeRequests,
            customersServed
        });
    } catch (err) {
        res.status(500).json({ message: 'Dashboard summary failed', error: err.message });
    }
};

// --- Add New Customer (with their main Machine) ---
exports.addCustomer = async (req, res) => {
    try {
        // Only Management or Service Head allowed (enforce in routes, not here)
        const { name, email, phone, address, machine } = req.body;
        if (!machine || !machine.model || !machine.serial) {
            return res.status(400).json({ message: "Machine details required with customer." });
        }
        const customer = new Customer({ name, email, phone, address, createdBy: req.user.id });
        await customer.save();

        // Main machine creation and linkage
        const newMachine = new Machine({
            ...machine,
            customer: customer._id,
            createdBy: req.user.id
        });
        await newMachine.save();
        customer.machines.push(newMachine._id);
        await customer.save();

        res.status(201).json({ message: 'Customer and machine added', customer, machine: newMachine });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add customer', error: error.message });
    }
};

// --- Add Machine by Management only (Not required for first machine on new customer) ---
exports.addMachine = async (req, res) => {
    try {
        const { serial, model, customerId, warrantyStatus } = req.body;
        const machine = new Machine({
            serial,
            model,
            customer: customerId,
            warrantyStatus,
            createdBy: req.user.id
        });
        await machine.save();
        // Link to customer
        await Customer.findByIdAndUpdate(customerId, { $push: { machines: machine._id } });
        res.status(201).json({ message: 'Machine added', machine });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add machine', error: error.message });
    }
};

// --- View Pending Tasks ---
exports.getPendingTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ status: 'To do' })
            .populate('assignees', 'name email')
            .populate('owner', 'name email')
            .populate('machineDetails.customer', 'name');
        res.json({ pendingTasks: tasks });
    } catch (error) {
        res.status(500).json({ message: 'Fetching pending tasks failed', error: error.message });
    }
};
