const mongoose = require('mongoose');


const subscriptionSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    companyName: { type: String },
    registerOnwashta: { type: Boolean },
    acceptOnlinePayment: { type: Boolean },
    additionalText: { type: String },
}, { timestamps: true });

const subscriptionModel = mongoose.model('subscription', subscriptionSchema);
module.exports = subscriptionModel;
