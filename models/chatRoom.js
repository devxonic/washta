const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id: { type: mongoose.Types.ObjectId },
    username: { type: String },
    role: { type: String, enum: ['customer', 'seller', 'admin', 'agent'] }
})
const chatMessageSchema = new mongoose.Schema({
    
    title: { type: String },
    user: userSchema,
    requestStatus: { type: String, enum: ['pending', 'ongoing', 'resolved', 'rejected'], default: "pending" },
    rejectedBy: userSchema,
    resolvedBy: userSchema,
    rejectedAt: { type: Date },
    resolvedAt: { type: Date },
    isSomeOneConnected: { type: Boolean, default: false },
    connectedWith: userSchema,
    isEnded: { type: Boolean },
    endedAt: { type: Date },
    endedBy: userSchema
}, {
    timestamps: true
});

const ChatMessage = mongoose.model('chatRoom', chatMessageSchema);

module.exports = ChatMessage;
