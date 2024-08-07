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
    status: { type: String, enum: ["ongoing", "inprocess", "completed", "cancelled"], default: "ongoing" },
    billingStatus: { type: String, enum: ["non-paid", "paid"], default: "non-paid" },
    date: { type: Date, default: Date.now },
    cost: { type: String },
    discount: { price: { type: Number, default: 0 }, percent: { type: String, default: "0%" } },
    // costSummary: { type: String }, // pending
    isCompleted: { type: Boolean },
    orderCompleteAt: { type: Date },
    orderAcceptedAt: { type: Date },
    isAccepted: { type: Boolean },
    carReceivedCenterAt: { type: Date },
    orderCompleteAt: { type: Date },
    isCancel: { type: Boolean },
    cancelBy: { type: String, enum: ["customer", 'seller', 'admin'] },
    cancellationResion: { type: String },
    cancellationTime: { type: Date },
    paymentId: { type: String },
    isDeleted: { type: Boolean },
    deletedAt: { type: Date },
    deleteBy: {
        id: { type: mongoose.Types.ObjectId },
        role: { type: String, enum: ["customer", 'seller', 'admin'] }
    },
    location: {
        type: pointSchema,
        default: {
            type: "Point",
            coordinates: [0, 0]
        },
        index: "2dsphere"
    },
}, { timestamps: true });

OrderSchema.index({ location: "2dsphere" });
const OrderModel = mongoose.model('order', OrderSchema);
module.exports = OrderModel;
