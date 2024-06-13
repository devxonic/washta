const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const shopSchema = new Schema({
    Owner: { type: mongoose.Types.ObjectId, ref: 'seller' },
    shopName: { type: String, unique: true },
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
        city: { type: String },
        text: { type: String, unique: true },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        },
    },
    cost: { type: Number }
})


const shopModel = mongoose.model('shop', shopSchema);
module.exports = shopModel;
