const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const pointSchema = new Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});

const shopSchema = new Schema({
    Owner: { type: mongoose.Types.ObjectId, ref: 'seller' },
    shopName: { type: String },
    coverImage: { type: String },
    sliderImage: [{ type: String }],
    isActive: { type: Boolean },
    shopDetails: { type: String }, //services
    estimatedServiceTime: { type: String }, // time Duration
    timing: {
        monday: {
            open: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        tuesday: {
            open: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        wednesday: {
            open: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        thursday: {
            open: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        friday: {
            open: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        saturday: {
            open: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },
        sunday: {
            open: { type: Boolean },
            from: { type: String },
            to: { type: String },
        },

    },
    location: {
        type: pointSchema,
        default: {
            type: "Point",
            coordinates: [0, 0]
        },
        index: "2dsphere"
    },
    cost: { type: Number }
})
shopSchema.index({ location: "2dsphere" });

const shopModel = mongoose.model('shop', shopSchema);
module.exports = shopModel;
