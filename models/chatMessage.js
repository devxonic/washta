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
        name: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId },
    }
}, {
    timestamps: true
});

const ChatMessage = mongoose.model('chatMessage', chatMessageSchema);

module.exports = ChatMessage;
