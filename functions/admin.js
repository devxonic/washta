const CustomerModel = require('../models/Customer');
const bcrypt = require('bcrypt');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');
const shopModel = require('../models/shop');
const OrderModel = require('../models/Order');


// ----------------------------------------------- Business -----------------------------------------------------//

const getBusinessbyStatus = async (req) => {
    let Business = await SellerModel.find({ 'business.status': req.query.status }, {
        notification: 0,
        privacy: 0,
        security: 0,
        password: 0,
        shops: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    })
    return Business
}


const updateStatus = async (req) => {
    let id = req.params.id
    let Business = await SellerModel.findByIdAndUpdate(id, { $set: { 'business.status': req.body.status } }, { fields: { 'business.status': 1 } })
    console.log("Body", Business)
    return Business
}

module.exports = {
    getBusinessbyStatus,
    updateStatus
}