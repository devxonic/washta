const mongoose = require('mongoose');


const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
    text: { type: String }
}, { _id: false });


const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Types.ObjectId, ref: "Customer" },
    vehicleId: { type: mongoose.Types.ObjectId, ref: "vehicle" },
    shopId: { type: mongoose.Types.ObjectId, ref: "shop" },
    status: { type: String, enum: ["ongoing", "completed", "pending", "cancelled"], default: "pending" },
    billingStatus: { type: String, enum: ["non-paid", "paid"], default: "non-paid" },
    date: { type: Date, default: Date.now },
    cost: { type: String },
    discount: { price: { type: Number, default: 0 }, percent: { type: String, default: "0%" } },
    // costSummary: { type: String }, // pending
    orderCompleteAt: { type: Date },
    orderAcceptedAt: { type: Date },
    carReceivedCenterAt: { type: Date },
    orderCompleteAt: { type: Date },
    isCancel: { type: Boolean },
    cancelBy: { type: String, enum: ["customer", 'seller', 'admin'] },
    cancellationResion: { type: String },
    cancellationTime: { type: Date },
    paymentId: { type: String },
    location: {
        type: pointSchema,
        default: {
            type: "Point",
            coordinates: [0, 0]
        },
        index: "2dsphere"
    },
});

OrderSchema.index({ location: "2dsphere" });
const OrderModel = mongoose.model('order', OrderSchema);
module.exports = OrderModel;
