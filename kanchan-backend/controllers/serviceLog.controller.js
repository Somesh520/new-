const ServiceLog = require('../models/serviceLog.model');
const emailjs = require('../utils/email');
const mongoose = require('mongoose');

// CREATE service log (Management/Service Head)
exports.createLog = async (req, res) => {
    try {
        // Check if req.body exists and has the required fields
        if (!req.body) {
            return res.status(400).json({ 
                message: 'Request body is required',
                error: 'No data provided in request body'
            });
        }

        const { title, serviceId, steps, notes, assignedEngineer, options } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({ 
                message: 'Title is required',
                error: 'Missing required field: title'
            });
        }

        if (!serviceId) {
            return res.status(400).json({ 
                message: 'Service ID is required',
                error: 'Missing required field: serviceId'
            });
        }

        const log = new ServiceLog({
            title,
            serviceId,
            steps: steps || [],
            notes: notes || '',
            assignedEngineer,
            options: options || {},
            createdBy: req.user.id
        });
        
        await log.save();

        // Send notification (urgent/new)
        if (options?.urgent || options?.notifyTeam) {
            await emailjs.sendServiceLogNotification(log, 'created');
        }
        
        res.status(201).json({ message: 'Service log created', log });
    } catch (error) {
        console.error('Error creating service log:', error);
        res.status(500).json({ 
            message: 'Failed to create service log', 
            error: error.message 
        });
    }
};

// VIEW all logs (filtered)
exports.listLogs = async (req, res) => {
    const { status, date, assignedEngineer } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (date) {
        const day = new Date(date);
        filter.createdAt = { $gte: new Date(day.setHours(0)), $lte: new Date(day.setHours(23,59,59,999)) };
    }
    if (assignedEngineer) filter.assignedEngineer = assignedEngineer;
    const logs = await ServiceLog.find(filter).populate('assignedEngineer', 'name email');
    res.json({ logs });
};

// VIEW one log by ID
exports.getLog = async (req, res) => {
    const log = await ServiceLog.findById(req.params.id)
        .populate('assignedEngineer', 'name email')
        .populate('history.user', 'name email');
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
};

// UPDATE log (Management/Service Head)
exports.updateLog = async (req, res) => {
    const updates = req.body;
    const log = await ServiceLog.findByIdAndUpdate(req.params.id, updates, { new: true })
        .populate('assignedEngineer', 'name email')
        .populate('history.user', 'name email');
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log updated', log });
};

// DELETE log (Management/Service Head)
exports.deleteLog = async (req, res) => {
    const log = await ServiceLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted' });
};

// UPDATE steps timeline (Management/Service Head)
exports.updateSteps = async (req, res) => {
    const { steps } = req.body; // [{label, status, completedAt}]
    const log = await ServiceLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });

    // Update steps/statuses
    log.steps = steps.map(st => ({
        ...st,
        completedAt: st.status === 'Completed' ? new Date() : undefined
    }));
    await log.save();
    res.json({ message: 'Steps/timeline updated', steps: log.steps });
};

// APPEND service history entry (Management/Service Head)
exports.addHistoryEntry = async (req, res) => {
    const { note } = req.body;
    const log = await ServiceLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    log.history.push({
        note,
        user: req.user.id
    });
    await log.save();
    res.json({ message: 'History entry added', history: log.history });
};

// VIEW service history entries (all)
exports.getHistory = async (req, res) => {
    const log = await ServiceLog.findById(req.params.id).populate('history.user', 'name email');
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ history: log.history });
};

// UPLOAD report/PDF (Management/Service Head)
exports.uploadReport = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const log = await ServiceLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    log.reportFile = `/uploads/reports/${req.file.filename}`;
    await log.save();
    res.json({ message: 'Report uploaded', reportFile: log.reportFile });
};

// CLOSE log/ticket (Management/Service Head)
exports.closeLog = async (req, res) => {
    const log = await ServiceLog.findByIdAndUpdate(req.params.id, { status: 'Closed', 'options.closeTicket': true }, { new: true });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    await emailjs.sendServiceLogNotification(log, 'closed');
    res.json({ message: 'Log closed', log });
};

// NOTIFY team via emailjs (ticket urgent/closed/new)
exports.notifyTeam = async (req, res) => {
    const log = await ServiceLog.findById(req.params.id).populate('assignedEngineer', 'email name');
    if (!log) return res.status(404).json({ message: 'Log not found' });
    await emailjs.sendServiceLogNotification(log, req.body.event || 'notify');
    res.json({ message: 'Notification triggered' });
};
