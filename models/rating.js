const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v >= 0.5 && v <= 5.0 && v % 0.5 === 0;
            },
            message: props => `${props.value} is not a valid rating! Rating must be between 0.5 and 5.0 in increments of 0.5.`
        }
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
    },
}, { timestamps: true });

const RatingModel = mongoose.model('Rating', ratingSchema);
module.exports = RatingModel;
