const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    media: {
        type: String
    },
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatroom'
    },
    sender: {
        username: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId },
        role: { type: String, enum: ['customer', 'seller', 'admin', 'agent'] }
    }
}, {
    timestamps: true
});

const ChatMessage = mongoose.model('chatMessage', chatMessageSchema);

module.exports = ChatMessage;
