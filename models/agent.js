const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    fullName: { type: String },
    password: {
        type: String,
        required: true,
    },
    email: { type: String },
}, { timestamps: true });

// Create the Rating model
const AgentModel = mongoose.model('agent', AgentSchema);

module.exports = AgentModel;
