const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({

    isActive: { type: Boolean },
    Discounttype: { type: String, enum: ["fixed", "percentage"] },
    promoCode: { type: String },
    discount: { type: String },
    duration: {
        startTime: { type: Date },
        endTime: { type: Date },
    },
    giveTo: [{
        type: mongoose.Types.ObjectId,
        ref: "Customer"
    }],
    usedBy: [{
        type: mongoose.Types.ObjectId,
        ref: "Customer"
    }],
    giveToAll: { type: Boolean },
    isDeleted: { type: Boolean },
    deletedAt: { type: Date },
    deleteBy: {
        id: { type: mongoose.Types.ObjectId },
        role: { type: String, enum: ["customer", 'seller', 'admin'] }
    },

}, { timestamps: true });


const PromoCodeModel = mongoose.model('promocode', PromoCodeSchema);
module.exports = PromoCodeModel;
