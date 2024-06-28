const CustomerModel = require('../models/Customer');
const bcrypt = require('bcrypt');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');
const shopModel = require('../models/shop');
const OrderModel = require('../models/Order');
const ServiceFeeModel = require('../models/servicefee');
const PromoCodeModel = require('../models/PromoCode');
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


// ----------------------------------------------- Shop -----------------------------------------------------//

const getShop = async (req) => {
    let Shop = await shopModel.find({})
    return Shop
}

const getShopbyid = async (req) => {
    let id = req.params.id
    let Shop = await shopModel.findById(id)
    return Shop
}


const UpdateShopbyAmdin = async (req) => {
    let id = req.params.id
    let { location, coverdAreaRaduis, service, cost } = req.body
    let Shop = await shopModel.findByIdAndUpdate(id, { "location.String": location, coverdAreaRaduis, service, cost }, { new: true })
    return Shop
}

const updateShopTiming = async (req) => {
    let { shopId, timing } = req.body
    let Shop = await shopModel.updateMany({ _id: { $in: shopId } }, { timing })
    if (Shop.modifiedCount > 0) {
        const updatedShop = await shopModel.find({ _id: { $in: shopId } }, { timing: 1 });
        return updatedShop
    }
    return Shop
}


// ----------------------------------------------- Customer -----------------------------------------------------//

const getCustomer = async (req) => {
    let Customer = await CustomerModel.find({}).populate({
        path: "vehicle",
    })
    return Customer
}

const getCustomerByid = async (req) => {
    let id = req.params.id
    let Customer = await CustomerModel.findById(id).populate({
        path: "vehicle",
    })
    return Customer
}


const updateCustomer = async (req) => {
    let id = req.params.id
    let { location, numberPlate, phone, email } = req.body // email is sensitive
    let Customer = await CustomerModel.findByIdAndUpdate(id, { location, phone, }, { new: true, fields: { location: 1, phone: 1 } })
    let Vehicle = await VehiclesModel.findOneAndUpdate({ $and: [{ Owner: req.user.id }, { isSelected: true }] }, { vehiclePlateNumber: numberPlate, }, { new: true })
     
    return { Customer, Vehicle }
}




// ----------------------------------------------- Service fee -----------------------------------------------------//

const createServiceFee = async (req) => {
    let { isAmountTaxable, ApplicableStatus, feeType, fees, applyAs, applyAt, applyAtAll } = req.body
    let Data = { isAmountTaxable, ApplicableStatus, feeType, fees, applyAs, applyAt, applyAtAll }
    if (applyAtAll) {
        let shops = await shopModel.find({}, { _id: 1 })
        let Formated = shops.map((x) => x._id.toString())
        Data.applyAt = Formated
    }
    let Service = await ServiceFeeModel(Data).save()
    return Service
}

const getserviceFee = async (req) => {
    let Service = await ServiceFeeModel.find({})
    return Service
}

const getserviceFeeById = async (req) => {
    let id = req.params.id
    let ServiceFee = await ServiceFeeModel.findById(id)
    return ServiceFee
}

const updateServiceFee = async (req) => {
    let id = req.params.id
    let { isAmountTaxable, ApplicableStatus, feeType, fees, applyAs, applyAt, applyAtAll } = req.body
    let Data = { isAmountTaxable, ApplicableStatus, feeType, fees, applyAs, applyAt, applyAtAll }
    if (applyAtAll) {
        let shops = await shopModel.find({}, { _id: 1 })
        let Formated = shops.map((x) => x._id.toString())
        Data.applyAt = Formated
    }
    let ServiceFee = await ServiceFeeModel.findByIdAndUpdate(id, Data, { new: true })
    return ServiceFee
}

// ----------------------------------------------- Promo Code -----------------------------------------------------//

const createPromoCode = async (req) => {
    let { isActive, promoCode, duration, giveTo, giveToAll } = req.body
    let Data = { isActive, promoCode, duration, giveTo, giveToAll }
    if (giveToAll) {
        let Customer = await CustomerModel.find({}, { _id: 1 })
        let Formated = Customer.map((x) => x._id.toString())
        Data.giveTo = Formated
    }
    console.log(giveTo)
    let upatedPromoCode = await PromoCodeModel(Data).save()
    return upatedPromoCode
}

const getPromoCode = async (req) => {
    let PromoCode = await PromoCodeModel.find({})
    return PromoCode
}

const getPromoCodeById = async (req) => {
    let id = req.params.id
    let PromoCode = await PromoCodeModel.findById(id)
    return PromoCode
}

const updatePromoCode = async (req) => {
    let id = req.params.id
    let { isActive, promoCode, duration, giveTo, giveToAll } = req.body
    let Data = { isActive, promoCode, duration, giveTo, giveToAll }
    if (giveToAll) {
        let Customer = await CustomerModel.find({}, { _id: 1 })
        let Formated = Customer.map((x) => x._id.toString())
        Data.giveTo = Formated
    }
    let Promocode = await PromoCodeModel.findByIdAndUpdate(id, Data, { new: true })
    return Promocode
}



module.exports = {
    getBusinessbyStatus,
    updateStatus,
    businessApprove,
    businessTerminate,
    JobHistory,
    getTopCustomer,
    getTopCompanies,
    UpdateShopbyAmdin,
    getShop,
    getShopbyid,
    updateShopTiming,
    getCustomer,
    getCustomerByid,
    updateCustomer,
    getserviceFee,
    createServiceFee,
    getserviceFeeById,
    updateServiceFee,
    createServiceFee,
    getserviceFee,
    getserviceFeeById,
    updateServiceFee,
    createPromoCode,
    getPromoCode,
    getPromoCodeById,
    updatePromoCode,

}