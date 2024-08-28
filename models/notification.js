const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    receiver: {
        id: { type: mongoose.Types.ObjectId },
        role: { type: String }
    },
    sender: {
        id: { type: mongoose.Types.ObjectId },
        profile: { type: String },
        username: { type: String },
        role: { type: String }
    },
    notification: {
        title: { type: String },
        body: { type: String }
    },
}, { timestamps: true });

const NotificationModel = mongoose.model('notification', NotificationSchema);
module.exports = NotificationModel;