const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Types.ObjectId, ref: "customer" },
    vehicleId: { type: mongoose.Types.ObjectId, ref: "vehicle" },
    shopId: { type: mongoose.Types.ObjectId, ref: "shop" },
    status: { type: String, enum: ["ongoing", "completed", "pending", "cancelled"], default: "pending" },
    billingStatus: { type: String, enum: ["non-paid", "paid"], default: "non-paid" },
    date: { type: Date, default: Date.now },
    cost: { type: String },
    discount: { price: { type: Number, default: 0 }, percent: { type: String, default: "0%" } },
    // costSummary: { type: String }, // pending
    payment: {
        card: {
            cardNumber: { type: String },
            cardHolerName: { type: String },
            CVV: { type: Number },
            expiryDate: { type: Date },
        }
    }
});


const OrderModel = mongoose.model('order', OrderSchema);
module.exports = OrderModel;
