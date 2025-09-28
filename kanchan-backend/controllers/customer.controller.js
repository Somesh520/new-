const Customer = require('../models/customer.model');
const Machine = require('../models/machine.model');
const mongoose = require('mongoose');

// --- Search by name or ID, returns minimal data for Customer Management search bar ---
exports.searchCustomers = async (req, res) => {
    const { q } = req.query;
    const query = q
        ? { $or: [
                { name: new RegExp(q, 'i') },
                { phone: new RegExp(q, 'i') },
                { _id: mongoose.Types.ObjectId.isValid(q) ? q : null }
            ]}
        : {};

    const customers = await Customer.find(query)
        .populate({
            path: 'machines',
            select: 'model serial warrantyStatus'
        });

    res.json({ customers });
};

// --- Get customer full profile for customer-management screen ---
exports.getCustomerProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id)
            .populate({
                path: 'machines',
                populate: [
                    { path: 'serviceRecords.engineer', select: 'name email' }
                ]
            });

        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // For display: Default first machine; front-end may request further
        const machine = customer.machines[0];
        let machineInfo = {};
        if (machine) {
            machineInfo = {
                model: machine.model,
                serial: machine.serial,
                warrantyExpiry: machine.warrantyExpiry,
                warrantyCode: machine.warrantyCode,
                warrantyStatus: machine.warrantyStatus,
                pendingDues: machine.pendingDues,
                serviceRecords: machine.serviceRecords
            }
        }
        res.json({
            customer: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address
            },
            machineInfo
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// --- Update by Management/Service Head only ---
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, machineId, machineUpdates } = req.body;
        // Customer update
        const updatedFields = {};
        if (name !== undefined) updatedFields.name = name;
        if (email !== undefined) updatedFields.email = email;
        if (phone !== undefined) updatedFields.phone = phone;
        if (address !== undefined) updatedFields.address = address;
        const customer = await Customer.findByIdAndUpdate(id, updatedFields, { new: true });

        let updatedMachine = null;
        if (machineId && machineUpdates) {
            updatedMachine = await Machine.findByIdAndUpdate(machineId, machineUpdates, { new: true });
        }

        res.json({ message: "Customer updated", customer, machine: updatedMachine });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};

// --- Delete by Management/Service Head only ---
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        await Machine.deleteMany({ customer: customer._id });
        await customer.remove();
        res.json({ message: "Customer and all related machines deleted" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};

// --- Add customer with machine (Management/Service Head only) ---
exports.addCustomerWithMachine = async (req, res) => {
    try {
        // 1. ADDED pendingAmount and dueDate here
        const { name, email, phone, address, machine, pendingAmount, dueDate } = req.body;

        // Validate required customer fields
        if (!name || !email || !phone) {
            return res.status(400).json({ 
                message: 'Missing required customer fields',
                required: ['name', 'email', 'phone']
            });
        }

        // Check if customer already exists by email or phone
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingCustomer) {
            return res.status(400).json({ 
                message: 'Customer already exists with this email or phone number' 
            });
        }

        // Prepare customer data object
        const customerData = {
            name,
            email,
            phone,
            address, // Assumes your schema is now an object
            pendingAmount: pendingAmount || 0, // Set default if not provided
            createdBy: req.user.id
        };

        // Only add dueDate if it exists in the request
        if (dueDate) {
            customerData.dueDate = dueDate;
        }

        // 2. CREATE NEW CUSTOMER WITH THE NEW FIELDS
        const customer = new Customer(customerData);

        await customer.save();

        // Create machine if machine details provided
        let savedMachine = null;
        if (machine && machine.model && machine.serial) {
            // Check if machine serial already exists
            const existingMachine = await Machine.findOne({ serial: machine.serial });
            if (existingMachine) {
                // Rollback customer creation
                await Customer.findByIdAndDelete(customer._id);
                return res.status(400).json({ 
                    message: 'Machine with this serial number already exists' 
                });
            }

            // ... (rest of the machine validation logic remains the same)
            if (machine.serviceRecords && Array.isArray(machine.serviceRecords)) {
                const User = require('../models/user.model');
                
                for (let record of machine.serviceRecords) {
                    if (record.engineer) {
                        if (!mongoose.Types.ObjectId.isValid(record.engineer)) {
                            await Customer.findByIdAndDelete(customer._id);
                            return res.status(400).json({ 
                                message: 'Invalid engineer ID format',
                                error: `Engineer ID "${record.engineer}" is not a valid ObjectId`
                            });
                        }
                        
                        const engineer = await User.findById(record.engineer);
                        if (!engineer) {
                            await Customer.findByIdAndDelete(customer._id);
                            return res.status(400).json({ 
                                message: 'Engineer not found',
                                error: `Engineer with ID "${record.engineer}" does not exist`
                            });
                        }
                    }
                }
            }

            savedMachine = new Machine({
                customer: customer._id,
                model: machine.model,
                serial: machine.serial,
                warrantyExpiry: machine.warrantyExpiry ? new Date(machine.warrantyExpiry) : null,
                warrantyCode: machine.warrantyCode || '',
                warrantyStatus: machine.warrantyStatus || 'In warranty',
                pendingDues: machine.pendingDues || [],
                serviceRecords: machine.serviceRecords || [],
                createdBy: req.user.id
            });

            await savedMachine.save();

            // Add machine to customer's machines array
            customer.machines.push(savedMachine._id);
            await customer.save();
        }

        // Return populated customer data
        const populatedCustomer = await Customer.findById(customer._id)
            .populate('machines')
            .populate('machines.serviceRecords.engineer', 'name email role');

        res.status(201).json({
            success: true, 
            message: 'Customer and machine created successfully',
            customer: populatedCustomer,
            machine: savedMachine
        });

    } catch (error) {
        console.error('Add customer error:', error);
        res.status(500).json({ 
            message: 'Failed to add customer', 
            error: error.message 
        });
    }
};