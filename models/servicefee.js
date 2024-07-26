const mongoose = require('mongoose');

const ServiceFeeSchema = new mongoose.Schema({

    isAmountTaxable: { type: Boolean },
    ApplicableStatus: { type: Boolean },
    feeType: { type: String, enum: ["fixed", "percentage"] },
    WashtaFees: { type: Number },
    applyAs: { type: String, enum: ["perService", "perInvoice"] },
    applyAt: [{
        type: mongoose.Types.ObjectId,
        ref: "shop"
    }],
    applyAtAll: { type: Boolean }

}, { timestamps: true });


const ServiceModel = mongoose.model('serviceFee', ServiceFeeSchema);
module.exports = ServiceModel;
