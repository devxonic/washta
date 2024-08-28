const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AdminSchema = new Schema({
    username: { type: String, unique: true },
    fullName: { type: String },
    password: {
        type: String,
        required: true,
    },
    email: { type: String },
    phone: { type: String },
    role: { type: String, enum: ['admin', 'agent'], default: 'admin' },
    avatar: {
        type: String
    },
    resizedAvatar: {
        type: String
    },
    isTerminated: { type: Boolean },
    terminateBy: {
        id: { type: mongoose.Types.ObjectId },
        role: { type: String, enum: ['admin'] }
    },
    isActive: { type: Boolean, default: true },
    terminateAt: { type: Date },
    isVerifed: { type: Boolean, default: false },
    sessionKey: {
        type: String
    },
    notification: {
        general: {
            type: Boolean
        },
        sound: {
            type: Boolean
        },
        vibrate: {
            type: Boolean
        },
        appUpdates: {
            type: Boolean
        },
        receiveNotification: {
            type: String
        },
        doNotReceiveNotifocation: {
            type: Boolean
        }
    },
    privacy: {
        profilePicture: {
            type: String
        },
        profile: {
            type: String
        },
        lastSeen: {
            type: String
        },
        blockedUser: [],
        sendMessage: {
            type: String
        }
    },
    security: {
        faceId: {
            type: Boolean
        },
        rememberLoginDetails: {
            type: Boolean
        },
        touchId: {
            type: Boolean
        },

    },
}, { timestamps: true })



const AdminModel = mongoose.model('admin', AdminSchema);
module.exports = AdminModel;
