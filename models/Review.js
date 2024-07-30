const mongoose = require('mongoose');

const commnetSchema = new mongoose.Schema({
    text: { type: String }
})
const ReviewSchema = new mongoose.Schema({
    comment: commnetSchema,
    rating: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v >= 0.5 && v <= 5.0 && v % 0.5 === 0;
            },
            message: props => `${props.value} is not a valid rating! Rating must be between 0.5 and 5.0 in increments of 0.5.`
        }
    },
    date: { type: Date, default: new Date() },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop',
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller',
    },
    reply: [
        {
            replyTo: { type: mongoose.Schema.Types.ObjectId },
            replyBy: {
                id: { type: mongoose.Schema.Types.ObjectId },
                role: { type: String, enum: ['seller', 'customer', 'admin', 'agent'] }
            },
            comment: commnetSchema
        }
    ]
}, { timestamps: true });

const RatingModel = mongoose.model('review', ReviewSchema);
module.exports = RatingModel;
