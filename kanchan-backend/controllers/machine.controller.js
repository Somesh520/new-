const Machine = require('../models/machine.model');
const Customer = require('../models/customer.model');
const mongoose = require('mongoose');
const fs = require('fs-extra');

// SEARCH: Get machine by serial number (for search bar)
exports.searchBySerial = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Serial number required' });
    const machines = await Machine.find({ serial: new RegExp(q, 'i') })
        .populate('customer', 'name')
        .select('model serial customer warrantyStatus warrantyExpiry');
    res.json({ machines });
};

// GET full machine history/details
exports.getMachineHistory = async (req, res) => {
    const { id } = req.params;
    const machine = await Machine.findById(id)
        .populate('customer', 'name')
        .populate('serviceRecords.engineer', 'name email role');
    if (!machine) return res.status(404).json({ message: 'Machine not found' });

    res.json({
        serial: machine.serial,
        model: machine.model,
        customer: machine.customer,
        warranty: {
            start: machine.warrantyStart,
            expiry: machine.warrantyExpiry,
            code: machine.warrantyCode,
            status: machine.warrantyStatus,
            details: machine.warrantyDetails
        },
        manuals: machine.manuals,
        serviceRecords: machine.serviceRecords,
        sparesUsed: machine.sparesUsed,
        pendingDues: machine.pendingDues
    });
};

// ADD manual/drawing (Management/Service Head/Engineer only)
exports.uploadManual = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { id } = req.params;
    const machine = await Machine.findById(id);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });

    machine.manuals.push(`/uploads/manuals/${req.file.filename}`);
    await machine.save();
    res.json({ message: 'Manual uploaded', manuals: machine.manuals });
};

// ADD new service record (Management/Service Head/Engineer only)
exports.addServiceRecord = async (req, res) => {
    const { id } = req.params;
    const { summary, pendingPoints, closedPoints, engineer, date } = req.body;
    const machine = await Machine.findById(id);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });

    machine.serviceRecords.push({
        summary,
        pendingPoints,
        closedPoints,
        engineer: engineer || req.user.id,
        date: date || new Date()
    });
    await machine.save();
    res.json({ message: 'Service record added', serviceRecords: machine.serviceRecords });
};

// UPDATE warranty (Management/Service Head/Engineer only)
exports.updateWarranty = async (req, res) => {
    const { id } = req.params;
    const { warrantyStart, warrantyExpiry, warrantyCode, warrantyDetails, warrantyStatus } = req.body;
    const updated = await Machine.findByIdAndUpdate(id,
        { warrantyStart, warrantyExpiry, warrantyCode, warrantyDetails, warrantyStatus },
        { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Machine not found' });
    res.json({ message: 'Warranty info updated', warranty: updated });
};

// FULL HISTORY (all logged events, pending dues, manuals, service logs, spares, etc.)
exports.viewHistory = async (req, res) => {
    const { id } = req.params;
    const machine = await Machine.findById(id)
        .populate('customer', 'name')
        .populate('serviceRecords.engineer', 'name email role');
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    res.json(machine);
};
