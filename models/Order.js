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
});


const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Types.ObjectId, ref: "Customer" },
    vehicleId: { type: mongoose.Types.ObjectId, ref: "vehicle" },
    shopId: { type: mongoose.Types.ObjectId, ref: "shop" },
    status: { type: String, enum: ["ongoing", "completed", "pending", "cancelled"], default: "pending" },
    billingStatus: { type: String, enum: ["non-paid", "paid"], default: "non-paid" },
    date: { type: Date, default: Date.now },
    cost: { type: String },
    // discount: { price: { type: Number, default: 0 }, percent: { type: String, default: "0%" }, ref: { type: mongoose.Types.ObjectId } },
    serviceFee: [
        {
            id: { type: mongoose.Types.ObjectId },
            feeType: { type: String, enum: ["fixed", "percentage"] },
            WashtaFees: { type: String },
        }
    ],
    promoCode: {
        id: { type: mongoose.Types.ObjectId },
        Discounttype: { type: String, enum: ["fixed", "percentage"] },
        discount: { type: String },
    },
    // costSummary: { type: String }, // pending
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
