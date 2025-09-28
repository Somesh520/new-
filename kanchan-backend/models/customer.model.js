const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    
    // CORRECTED ADDRESS STRUCTURE
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String }
    },

    // NEW FIELDS ADDED
    pendingAmount: { type: Number, default: 0 },
    dueDate: { type: Date },

    machines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Machine' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);