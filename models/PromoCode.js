const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({

    isActive: { type: Boolean },
    Discounttype: { type: String, enum: ["fixed", "percentage"] },
    promoCode: { type: String, unique: true },
    discount: { type: String },
    duration: {
        startTime: { type: Date },
        endTime: { type: Date },
    },
    giveTo: [{
        customerId: { type: mongoose.Types.ObjectId, ref: "Customer", },
        isUsed: { type: Boolean, default: false },
    }
    ],
    giveToAll: { type: Boolean }

}, { timestamps: true });


const PromoCodeModel = mongoose.model('promocode', PromoCodeSchema);
module.exports = PromoCodeModel;
