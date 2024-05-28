const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CustomerSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, },
    username: { type: String },
    password: {
        type: String,
        required: true,
        minlength: [7, 'Password must be at least 7 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [
          'Please fill a valid email address'
        ]
      },
    phone: {
        type: String,
    },
    cars: [{
        carName: { type: String },
        carPlateNumber: { type: String },
        carType: { type: String },
        carManufacturer: { type: String },
    }],
    isVerified: { type: Boolean, default: false },
    sessionKey: {
        type: String
    },
    notification: {
        general: {
            type: Boolean,
            default: false
        },
        sound: {
            type: Boolean,
            default: false
        },
        vibrate: {
            type: Boolean,
            default: false
        },
        appUpdates: {
            type: Boolean,
            default: false
        },
        receiveNotification: {
            type: String
        },
        doNotReceiveNotifocation: {
            type: String
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
            type: Boolean,
            default: false
        },
        rememberLoginDetails: {
            type: Boolean,
            default: false
        },
        touchId: {
            type: Boolean,
            default: false
        },

    },
}, { timestamps: true })



const CustomerModel = mongoose.model('Customer', CustomerSchema);
module.exports = CustomerModel;
