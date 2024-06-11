const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const shopSchema = new Schema({
    Owner: { type: mongoose.Types.ObjectId, ref: 'seller' },
    shopName: { type: String, unique: true },
    coverImage: { type: String },
    sliderImage: [{ type: String }],
    isActive: { type: Boolean },
    service: { type: String },
    timing: {
        from: { type: String },
        to: { type: String },
    },
    location: {
        string: { type: String, unique: true },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        },
    },
    charges: { type: Number }

})



// Create a unique index on the coordinates array
shopSchema.index({ 'location.string': 1 }, { unique: true });

const shopModel = mongoose.model('shop', shopSchema);
module.exports = shopModel;
