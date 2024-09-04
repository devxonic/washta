const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({

    title: { type: String },
    user: {
        id: { type: mongoose.Types.ObjectId },
        username: { type: String },
        role: { type: String, enum: ['customer', 'seller', 'admin', 'agent'] }
    },
    requestStatus: { type: String, enum: ['pending', 'ongoing', 'resolved', 'rejected'], default: "pending" },
    isSomeOneConnected: { type: Boolean, default: false },
    connectedWith: {
        id: { type: mongoose.Types.ObjectId },
        username: { type: String },
        role: { type: String, enum: ['customer', 'seller', 'admin', 'agent'] }
    },
    isEnded: { type: Boolean },
    endedAt: { type: Date },
    endedBy: {
        id: { type: mongoose.Types.ObjectId },
        username: { type: String },
        role: { type: String, enum: ['customer', 'seller', 'admin', 'agent'] }
    }
}, {
    timestamps: true
});

const ChatMessage = mongoose.model('chatRoom', chatMessageSchema);

module.exports = ChatMessage;
