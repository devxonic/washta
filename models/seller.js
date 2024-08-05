const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SellerSchema = new Schema({
    username: { type: String, unique: true },
    fullName: { type: String },
    password: {
        type: String,
        required: true,
    },
    email: { type: String },
    phone: { type: String },
    business: {
        uploadDocument: { type: String },
        companyName: { type: String },
        location: { type: String },
        VATNumber: { type: String },
        fullName: { type: String },
        position: { type: String },
        email: { type: String },
        status: { type: String, enum: ["approved", "pending", "rejected", "terminate"], default: "pending" },
        isApproved: { type: Boolean, default: false },
        isTerminated: { type: Boolean, default: false },
        isRejected: { type: Boolean, default: false },
        approvedAt: { type: Date },
        terminatedAt: { type: Date },
        cratedAt: { type: Date },
        rejectedAt: { type: Date },
    },
    shops: [{ type: mongoose.Types.ObjectId, ref: 'shop' }],
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
    }
},
    { timestamps: true },
);

const SellerModel = mongoose.model("seller", SellerSchema);
module.exports = SellerModel;
