const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const shopSchema = new Schema({
    coverImage: { type: String },
    sliderImage: [{ type: String }],
    isActive: { type: Boolean },
    service: { type: String },
    timing: {
        from: { type: String },
        to: { type: String },
    },
    location: {
        string: { type: String },
        coordinates: {
            latitude: { type: number },
            longitude: { type: number }
        }
    },
    charges: { type: number }

})


const shopModel = mongoose.model('shop', shopSchema);
module.exports = shopModel;
