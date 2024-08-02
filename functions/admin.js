const CustomerModel = require('../models/Customer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');
const shopModel = require('../models/shop');
const OrderModel = require('../models/Order');
const reviewModel = require('../models/Review');
const ServiceFeeModel = require('../models/servicefee');
const PromoCodeModel = require('../models/PromoCode');
const helper = require('../helpers/helper');
const { default: mongoose } = require('mongoose');


// ----------------------------------------------- Business -----------------------------------------------------//

const getBusinessbyStatus = async (req) => {
    if (req.query.status) {
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
    return null
}

const getAllBusniess = async (req) => {

    let Business = await SellerModel.find({}, { business: 1 })
    return Business
}

const getBusinessById = async (req) => {
    let Business = await SellerModel.findById(req.params.id, { business: 1 })
    return Business
    return null
}


const businessApprove = async (req) => {
    let id = req.params.id
    let Business = await SellerModel.findByIdAndUpdate(id, { $set: { 'business.isApproved': true, 'business.status': "approved" } }, { new: true, fields: { 'business': 1, 'email': 1 } })
    if (!Business) return null

    const transporter = nodemailer.createTransport({
        host: process.env.mailerHost,
        port: process.env.mailerPort,
        auth: {
            user: process.env.mailerEmail,
            pass: process.env.mailerPassword,
        },
    });
    let mailPath = path.resolve(__dirname, `../Mails/EmailVerification/index.ejs`)
    let Mail = await ejs.renderFile(mailPath, { data: { Code: "Approved" } });
    if (Business.email) {
        let transporterRes = await transporter.sendMail({
            from: process.env.mailerEmail,
            to: Business.email,
            subject: "Verification",
            html: Mail,
        })
    }
    return Business
}

const businessTerminate = async (req) => {
    let id = req.params.id
    let Business = await SellerModel.findByIdAndUpdate(id, { $set: { 'business.isApproved': false, 'business.status': "terminate", 'business.isTerminated': true, } }, { new: true, fields: { 'business': 1, 'email': 1 } })
    const transporter = nodemailer.createTransport({
        host: process.env.mailerHost,
        port: process.env.mailerPort,
        auth: {
            user: process.env.mailerEmail,
            pass: process.env.mailerPassword,
        },
    });
    console.log("mails -------------",)
    let mailPath = path.resolve(__dirname, `../Mails/EmailVerification/index.ejs`)
    let Mail = await ejs.renderFile(mailPath, { data: { Code: "Terminated" } });
    if (Business.email) {
        let transporterRes = transporter.sendMail({
            from: process.env.mailerEmail,
            to: Business.email,
            subject: "Verification",
            html: Mail,
        })
    }
    return Business
}

const businessReject = async (req) => {
    let id = req.params.id
    let Business = await SellerModel.findByIdAndUpdate(id, { $set: { 'business.isApproved': false, 'business.status': "rejected", 'business.isTerminated': false, } }, { new: true, fields: { 'business': 1, 'email': 1 } })
    if (!Business) return null
    const transporter = nodemailer.createTransport({
        host: process.env.mailerHost,
        port: process.env.mailerPort,
        auth: {
            user: process.env.mailerEmail,
            pass: process.env.mailerPassword,
        },
    });
    console.log(id)
    console.log(Business)
    let mailPath = path.resolve(__dirname, `../Mails/EmailVerification/index.ejs`)
    let Mail = await ejs.renderFile(mailPath, { data: { Code: "Rejeced" } });
    if (Business.email) {
        let transporterRes = await transporter.sendMail({
            from: process.env.mailerEmail,
            to: Business.email,
            subject: "Verification",
            html: Mail,
        })
    } return Business
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
    let Customer = await CustomerModel.find({}, {
        privacy: 0, password: 0, createdAt: 0, updatedAt: 0
    }).populate([{
        path: "selectedVehicle",
    }])
    return Customer
}

const getCustomerByid = async (req) => {
    let id = req.params.id
    let Customer = await CustomerModel.findById(id, {
        privacy: 0, password: 0, createdAt: 0, updatedAt: 0
    }).populate({
        path: "selectedVehicle",
    })
    return Customer
}


const updateCustomer = async (req) => {
    let id = req.params.id
    let { location, numberPlate, phone, email } = req.body // email is sensitive
    let Customer = await CustomerModel.findByIdAndUpdate(id, { location, phone, }, { new: true, fields: { location: 1, phone: 1 } })
    let Vehicle = await VehiclesModel.findOneAndUpdate({ $and: [{ Owner: id }, { isSelected: true }] }, { vehiclePlateNumber: numberPlate, }, { new: true })

    return { Customer, Vehicle }
}

// ----------------------------------------------- Vehical -----------------------------------------------------//

const getVehicles = async (req) => {
    let Vehicles = await VehiclesModel.find({})
    return Vehicles
}


const getvehiclesById = async (req) => {
    let id = req.params.id
    let Vehicles = await VehiclesModel.findById(id)
    return Vehicles
}


const updateVehicles = async (req) => {
    let id = req.params.id
    let { vehicleManufacturer, vehiclePlateNumber, vehicleName, vehicleType } = req.body
    let Vehicle = await VehiclesModel.findOneAndUpdate({ $or: [{ $and: [{ Owner: id }, { isSelected: true }] }, { _id: id }] }, { vehicleManufacturer, vehiclePlateNumber, vehicleName, vehicleType }, { new: true })

    return Vehicle
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

// ----------------------------------------------- Reviews -----------------------------------------------------//

const getShopReviews = async (req) => {
    let { shopId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "sellerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                shopDetails: 1,
                estimatedServiceTime: 1,
                cost: 1,
            }
        },
        {
            path: "orderId", select: {
                customerId: 0,
                vehicleId: 0,
                shopId: 0,
                location: 0,
            }
        }
    ]

    if (!shopId) {
        let Reviews = await reviewModel.find({ shopId, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        return Reviews
    }

    let Reviews = await reviewModel.find({ shopId: { $exists: true }, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    return Reviews
}


const getSellerReviews = async (req) => {
    let { sellerId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "sellerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                shopDetails: 1,
                estimatedServiceTime: 1,
                cost: 1,
            }
        },
        {
            path: "orderId", select: {
                customerId: 0,
                vehicleId: 0,
                shopId: 0,
                location: 0,
            }
        }
    ]

    if (!sellerId) {
        let Reviews = await reviewModel.find({ sellerId, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        return Reviews
    }

    let Reviews = await reviewModel.find({ sellerId: { $exists: true }, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    return Reviews
}

const getOrderReviews = async (req) => {
    let { orderId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "sellerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                shopDetails: 1,
                estimatedServiceTime: 1,
                cost: 1,
            }
        },
        {
            path: "orderId", select: {
                customerId: 0,
                vehicleId: 0,
                shopId: 0,
                location: 0,
            }
        }
    ]

    if (!orderId) {
        let Reviews = await reviewModel.find({ orderId, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        return Reviews
    }

    let Reviews = await reviewModel.find({ orderId: { $exists: true }, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    return Reviews
}

const getCustomerReviews = async (req) => {
    let { customerId, limit } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "sellerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        {
            path: "shopId", select: {
                Owner: 1,
                shopName: 1,
                coverImage: 1,
                isActive: 1,
                shopDetails: 1,
                estimatedServiceTime: 1,
                cost: 1,
            }
        },
        {
            path: "orderId", select: {
                customerId: 0,
                vehicleId: 0,
                shopId: 0,
                location: 0,
            }
        }
    ]

    if (!customerId) {
        let Reviews = await reviewModel.find({ customerId, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
        return Reviews
    }

    let Reviews = await reviewModel.find({ customerId: { $exists: true }, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    return Reviews
}


const replyToReview = async (req) => {
    let { reviewId } = req.query
    let { comment, replyTo } = req.body
    let Review = await reviewModel.findOne({ _id: reviewId });
    if (!Review) return null
    let body = {
        replyTo,
        replyBy: {
            id: req.user.id,
            role: 'admin'
        },
        comment
    }
    console.log(body)

    let reply = reviewModel.findOneAndUpdate({ _id: Review }, { $push: { reply: { ...body } } }, { new: true })
    return reply
}

const editMyReplys = async (req) => {
    let { reviewId } = req.query
    let { commentId, comment } = req.body
    let Review = await reviewModel.findOne({ _id: reviewId });
    if (!Review) return null
    let myReply = Review.reply.map(reply => {
        if (reply.replyBy.id.toString() == req.user.id && commentId == reply.comment._id.toString()) {
            reply.comment.text = comment.text
            return reply
        }
        return reply
    })

    let reply = reviewModel.findOneAndUpdate({ _id: Review }, { reply: myReply }, { new: true, fields: { comment: 1, shopId: 1, reply: 1 } })
    return reply
}


const deleteReviews = async (req) => {
    let { reviewId } = req.query
    let Review = await reviewModel.findOneAndUpdate({ _id: reviewId }, { deleteBy: { id: req.user.id, role: 'admin' }, isDeleted: true }, { new: true });
    return Review
}


module.exports = {
    getBusinessbyStatus,
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
    getVehicles,
    getvehiclesById,
    updateVehicles,
    getAllBusniess,
    getBusinessById,
    businessReject,
    getShopReviews,
    replyToReview,
    editMyReplys,
    deleteReviews,
    getSellerReviews,
    getOrderReviews,
    getCustomerReviews,

}