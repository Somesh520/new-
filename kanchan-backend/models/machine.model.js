const mongoose = require('mongoose');

const ServiceRecordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    summary: { type: String },
    engineer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pendingPoints: [{ type: String }],
    closedPoints: [{ type: String }]
});

const MachineSchema = new mongoose.Schema({
    machineId: { type: String, unique: true },
    model: { type: String, required: true },
    serial: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    // Warranty info
    warrantyExpiry: { type: Date },
    warrantyCode: { type: String },
    warrantyStatus: { type: String, enum: ['In warranty', 'Out of warranty'], default: 'In warranty' },
    warrantyDetails: { type: String }, // e.g. "Full 2 years parts and labor"
    // Financials
    pendingDues: [{
        amount: { type: Number, required: true },
        dueDate: { type: Date, required: true }
    }],
    // History
    serviceRecords: [ServiceRecordSchema],
    manuals: [{ type: String }], // File paths/URLs (PDF/image/CAD)
    sparesUsed: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Pre-save hook to generate unique machineId if not present
MachineSchema.pre('save', async function (next) {
    if (!this.machineId) {
        const timestamp = Date.now().toString().slice(-6);
        const modelPrefix = this.model.replace(/\s+/g, '').substring(0, 4).toUpperCase();
        this.machineId = `${modelPrefix}-${timestamp}`;
        let counter = 1;
        let baseId = this.machineId;
        while (await mongoose.model('Machine').findOne({ machineId: this.machineId })) {
            this.machineId = `${baseId}-${counter}`;
            counter++;
        }
    }
    next();
});

module.exports = mongoose.model('Machine', MachineSchema);
