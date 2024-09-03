const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({

    name: { type: String },
    title: { type: String },
    users: {
        type: mongoose.Types.ObjectId,
        username: { type, String },
        role: { type: String, enum: ['customer', 'seller', 'admin', 'agent'] }
    },
    requestStatus: { type: String, enum: ['pending', 'ongoing', 'resolved', 'unresolved'] },
    isSomeOneConnected: { type: Boolean },
    isConnected: {
        type: mongoose.Types.ObjectId,
        username: { type, String },
        role: { type: String, enum: ['customer', 'seller', 'admin', 'agent'] }
    },
    isEnded: { type: Boolean },
    endedAt: { type: Date },
    endedBy: { _id }
}, {
    timestamps: true
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
