const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
    label: String,
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    completedAt: Date
});
const HistorySchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String
});
const OptionSchema = new mongoose.Schema({
    closeTicket: { type: Boolean, default: false },
    notifyTeam: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false }
});
const ServiceLogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    serviceId: { type: String },
    status: { type: String, enum: ['Open', 'Pending', 'Closed'], default: 'Open' },
    steps: [StepSchema],
    notes: String,
    history: [HistorySchema],
    reportFile: String,
    options: OptionSchema,
    assignedEngineer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('ServiceLog', ServiceLogSchema);
