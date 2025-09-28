const Task = require('../models/task.model');
const User = require('../models/user.model');
const sendTaskNotification = require('../utils/email');
const Joi = require('joi');
const mongoose = require('mongoose');

// Validation schema for task creation
const createTaskSchema = Joi.object({
    title: Joi.string().required().min(1).max(200),
    description: Joi.string().allow('').max(1000),
    dueDate: Joi.date().allow(null),
    assignees: Joi.alternatives().try(
        Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)), // Array of ObjectIds
        Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // Single ObjectId
        Joi.string().allow('') // Empty string
    ).allow(null),
    status: Joi.string().valid('To do', 'In progress', 'Completed').default('To do')
});

// Create a new task
exports.createTask = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = createTaskSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                error: error.details[0].message
            });
        }

        const { title, description, dueDate, assignees, status } = value;

        // Normalize assignees to always be an array of valid ObjectId strings from existing users
        let processedAssignees = [];
        if (assignees) {
            if (typeof assignees === 'string') {
                if (assignees.trim() === '') {
                    processedAssignees = [];
                } else if (assignees.startsWith('[') && assignees.endsWith(']')) {
                    try {
                        processedAssignees = JSON.parse(assignees);
                    } catch {
                        processedAssignees = [assignees];
                    }
                } else {
                    processedAssignees = [assignees];
                }
            } else if (Array.isArray(assignees)) {
                processedAssignees = assignees;
            } else {
                processedAssignees = [assignees];
            }
        }

        // Validate assignees: only keep existing user IDs
        const validAssignees = [];
        for (const id of processedAssignees) {
            if (
                typeof id === 'string' &&
                id.trim() !== '' &&
                mongoose.Types.ObjectId.isValid(id)
            ) {
                const userExists = await User.findById(id);
                if (userExists) validAssignees.push(userExists._id); // Save ObjectId not string
            }
        }

        // Ensure owner is always set to the logged-in user
        const ownerId = req.user?.id || req.user?._id;
        if (!ownerId) throw new Error('Authentication required: owner missing.');

        // Create and save the new task
        const task = new Task({
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            owner: ownerId,
            assignees: validAssignees,
            status: status || 'To do',
        });
        await task.save();

        // Populate owner and assignees for response
        const populatedTask = await Task.findById(task._id)
            .populate('owner', 'name email role')
            .populate('assignees', 'name email role');

        // Send notification via EmailJS (customize as needed per recipient/role)
        sendTaskNotification({
            subject: `New Task Created: ${title}`,
            to_email: 'management@email.com', // Replace with actual recipient logic
            message: `Task created: ${title} by ${(req.user && req.user.email) || "Unknown"}`,
            user: ownerId
        });

        res.status(201).json({
            message: 'Task created successfully',
            task: populatedTask
        });
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// Get all tasks (filtered by status/date/query)
exports.getTasks = async (req, res) => {
    try {
        const { status, date } = req.query;
        let filter = {};
        if (status) filter.status = status;
        if (date) {
            const dayStart = new Date(date);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            filter.dueDate = { $gte: dayStart, $lte: dayEnd };
        }
        // Show if user is owner or assignee
        filter.$or = [
            { owner: req.user?.id || req.user?._id },
            { assignees: req.user?.id || req.user?._id }
        ];
        const tasks = await Task.find(filter)
            .populate('assignees', 'name email role')
            .populate('owner', 'name email role');
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id)
            .populate('owner', 'name email role')
            .populate('assignees', 'name email role');
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Only allow owner, assignee, management, or service head to see
        const userId = req.user?.id || req.user?._id;
        const allowed =
            task.owner._id.toString() === userId ||
            task.assignees.some(a => a._id.toString() === userId) ||
            ['Management', 'Service Head'].includes(req.user.role);

        if (!allowed) {
            return res.status(403).json({ message: 'Access denied to this task' });
        }
        res.json({ task });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
};

// Update task (status, description, etc.)
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const task = await Task.findByIdAndUpdate(id, updates, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Populate updated fields
        const populatedTask = await Task.findById(task._id)
            .populate('owner', 'name email role')
            .populate('assignees', 'name email role');

        res.json({ message: 'Task updated', task: populatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// Upload attachment to task
exports.uploadAttachment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file)
            return res.status(400).json({ message: 'No file uploaded' });
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.attachments.push('/uploads/attachments/' + req.file.filename);
        await task.save();

        res.json({ message: 'Attachment uploaded', attachments: task.attachments });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading attachment', error: error.message });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task)
            return res.status(404).json({ message: 'Task not found' });

        const userId = req.user?.id || req.user?._id;
        const canDelete =
            task.owner.toString() === userId ||
            ['Management', 'Service Head'].includes(req.user.role);

        if (!canDelete) {
            return res.status(403).json({ message: 'Access denied. Only task owner, Management, or Service Head can delete tasks.' });
        }

        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};
