const CustomerModel = require('../models/Customer');
const bcrypt = require('bcrypt');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');
const shopModel = require('../models/shop');
const OrderModel = require('../models/Order');
const helper = require('../helpers/helper');


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

const businessApprove = async (req) => {
    let id = req.params.id
    let Business = await SellerModel.findByIdAndUpdate(id, { $set: { 'business.isApproved': true, 'business.status': "approved" } }, { new: true, fields: { 'business.status': 1, 'business.isApproved': 1 } })
    return Business
}

const businessTerminate = async (req) => {
    let id = req.params.id
    let Business = await SellerModel.findByIdAndUpdate(id, { $set: { 'business.isApproved': false, 'business.status': "rejected" } }, { new: true, fields: { 'business.status': 1, 'business.isApproved': 1 } })
    return Business
}


// ----------------------------------------------- Job History -----------------------------------------------------//

const JobHistory = async (req) => {
    let Business = await OrderModel.find({}).populate([{ path: "shopId", select: "-timing" }, {
        path: "customerId", select: ["-privacy", "-password", "-createdAt", "-updatedAt", "-__v"]
    }, { path: "vehicleId" }])
    console.log(Business)
    return Business
}

// ----------------------------------------------- Top Comp / Cust -----------------------------------------------------//

const getTopCustomer = async (req) => {
    let Order = await OrderModel.find({})
    let Customer = await CustomerModel.find({})
    // console.log(Order)
    // console.log("query ------------", req.query.limit)

    let sortedData = helper.getTopCustomersBySpending(Order, Customer, req.query.limit)
    return sortedData
}


const getTopCompanies = async (req) => {
    let Order = await OrderModel.find({})
    console.log(Order)
    console.log("query ------------", req.query.limit)

    let sortedData = helper.getTopCustomersBySpending(Order, req.query.limit)
    return sortedData
}


module.exports = {
    getBusinessbyStatus,
    updateStatus,
    businessApprove,
    businessTerminate,
    JobHistory,
    getTopCustomer,
    getTopCompanies
}