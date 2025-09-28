const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['To do', 'In progress', 'Completed'], default: 'To do' },
    dueDate: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    attachments: [{ type: String }],
    kpis: [{ key: String, value: String }],
    openPoints: [{ type: String }],
    machineDetails: {
        customer: String,
        machineId: String,
        warrantyStatus: String
    },
    pendingAmounts: [{ type: Number }],
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Task', TaskSchema);
