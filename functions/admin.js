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
const AdminModel = require('../models/admin');


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
}


const businessApprove = async (req) => {
    let id = req.params.id
    let date = new Date()
    let body = {
        "business.isApproved": true,
        "business.isTerminated": false,
        "business.isRejected": false,
        "business.status": "approved",
        "business.approvedAt": date
    }
    let Business = await SellerModel.findByIdAndUpdate(id, { $set: { ...body } }, { new: true, fields: { 'business': 1, 'email': 1, fullName: 1, username: 1 } })
    if (!Business) return null

    const transporter = nodemailer.createTransport({
        host: process.env.mailerHost,
        port: process.env.mailerPort,
        auth: {
            user: process.env.mailerEmail,
            pass: process.env.mailerPassword,
        },
    });
    let mailPath = path.resolve(__dirname, `../Mails/BusinessAproval/index.ejs`)
    let Mail = await ejs.renderFile(mailPath, { data: { name: Business.fullName ?? Business.username, msg: "Approved" } });
    if (Business.business.email) {
        let transporterRes = await transporter.sendMail({
            from: process.env.mailerEmail,
            to: Business.business.email,
            subject: "Business Update",
            html: Mail,
        })
        console.log("mail is Sended to Seller", transporterRes)
    }
    return Business
}

const businessTerminate = async (req) => {
    let id = req.params.id
    let date = new Date()
    let body = {
        "business.isApproved": false,
        "business.isRejected": false,
        "business.isTerminated": true,
        "business.status": 'terminated',
        "business.terminatedAt": date
    }
    let Business = await SellerModel.findByIdAndUpdate(id, { $set: { ...body } }, { new: true, fields: { 'business': 1, 'email': 1, fullName: 1, username: 1 } })
    const transporter = nodemailer.createTransport({
        host: process.env.mailerHost,
        port: process.env.mailerPort,
        auth: {
            user: process.env.mailerEmail,
            pass: process.env.mailerPassword,
        },
    });
    let mailPath = path.resolve(__dirname, `../Mails/BusinessAproval/index.ejs`)
    let Mail = await ejs.renderFile(mailPath, { data: { name: Business.fullName ?? Business.username, msg: " Terminated " } });
    if (Business.business.email) {
        let transporterRes = await transporter.sendMail({
            from: process.env.mailerEmail,
            to: Business.business.email,
            subject: "Business Update",
            html: Mail,
        })
        console.log("mail is Sended to Seller", transporterRes)
    }
    return Business
}

const businessReject = async (req) => {
    let id = req.params.id
    let date = new Date()
    let body = {
        "business.isApproved": false,
        "business.isRejected": true,
        "business.isTerminated": false,
        "business.status": 'rejected',
        "business.rejectedAt": date
    }
    let Business = await SellerModel.findByIdAndUpdate(id, { $set: { ...body } }, { new: true, fields: { 'business': 1, 'email': 1, fullName: 1, username: 1 } })
    if (!Business) return null
    const transporter = nodemailer.createTransport({
        host: process.env.mailerHost,
        port: process.env.mailerPort,
        auth: {
            user: process.env.mailerEmail,
            pass: process.env.mailerPassword,
        },
    });
    let mailPath = path.resolve(__dirname, `../Mails/BusinessAproval/index.ejs`)
    let Mail = await ejs.renderFile(mailPath, { data: { name: Business.fullName ?? Business.username, msg: " Rejected " } });
    if (Business.business.email) {
        let transporterRes = await transporter.sendMail({
            from: process.env.mailerEmail,
            to: Business.business.email,
            subject: "Business Update",
            html: Mail,
        })
        console.log("mail is Sended to Seller", transporterRes)
    }
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
    let { limit } = req.query
    let orders = await OrderModel.find({})
    let customerFilter = {
        username: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        selectedVehicle: 1,
        isTerminated: 1,
        isVerifed: 1,
    }
    let customerData = {}
    for (const singleOrder of orders) {
        let customer = await CustomerModel.findOne({ _id: singleOrder?.customerId }, customerFilter)
        if (customer) {
            if (!customerData[singleOrder?.customerId]) {
                customerData[singleOrder?.customerId] = { ...customer?._doc, totalSpents: 0, totalOrders: 0 }
            }
            customerData[singleOrder?.customerId].totalOrders++
            customerData[singleOrder?.customerId].totalSpents += parseFloat(singleOrder.cost)
        }
    }

    let customerArray = Object.values(customerData)
    customerArray.sort((a, b) => {
        if (b.totalSpents === a.totalSpents) {
            return b.totalOrders - a.totalOrders;
        }
        return b.totalSpents - a.totalSpents;
    });
    if (limit) {
        const topCustomers = customerArray.slice(0, limit);
        console.log("top customers Limited")
        return topCustomers
    }
    return customerArray
}


const getTopSellers = async (req) => {
    let { limit } = req.query
    let orders = await OrderModel.find({})
    let sellerFilter = {
        username: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        status: 1,
        shops: 1,
        isVerifed: 1,
        'business.companyName': 1,
        'business.location': 1,
    }
    let companiesData = {}
    for (const singleOrder of orders) {
        let seller = await shopModel.findOne({ _id: singleOrder?.shopId }, { Owner: 1 }).populate({ path: 'Owner', select: sellerFilter })
        if (seller) {
            if (!companiesData[singleOrder?.shopId]) {
                companiesData[singleOrder?.shopId] = { ...seller?.Owner?._doc, totalRevenue: 0, totalOrders: 0 }
            }
            companiesData[singleOrder?.shopId].totalOrders++
            companiesData[singleOrder?.shopId].totalRevenue += parseFloat(singleOrder.cost)
        }
    }

    let companiesArray = Object.values(companiesData)
    companiesArray.sort((a, b) => {
        if (b.totalRevenue === a.totalRevenue) {
            return b.totalOrders - a.totalOrders;
        }
        return b.totalRevenue - a.totalRevenue;
    });
    if (limit) {
        const topCompanies = companiesArray.slice(0, limit);
        console.log("top customers Limited")
        return topCompanies
    }
    return companiesArray
}

const getTopCompanies = async (req) => {
    let { limit } = req.query
    let orders = await OrderModel.find({})
    let shopFilter = {
        Owner: 1,
        shopName: 1,
        coverImage: 1,
        sliderImage: 1,
        isActive: 1,
        shopDetails: 1,
        estimatedServiceTime: 1,
        isTerminated: 1,
        location: 1,
        cost: 1,
    }
    let companiesData = {}
    for (const singleOrder of orders) {
        let Shop = await shopModel.findOne({ _id: singleOrder?.shopId }, shopFilter)
        if (Shop) {
            if (!companiesData[singleOrder?.shopId]) {
                companiesData[singleOrder?.shopId] = { ...Shop?._doc, totalRevenue: 0, totalOrders: 0 }
            }
            companiesData[singleOrder?.shopId].totalOrders++
            companiesData[singleOrder?.shopId].totalRevenue += parseFloat(singleOrder.cost)
        }
    }

    let companiesArray = Object.values(companiesData)
    companiesArray.sort((a, b) => {
        if (b.totalRevenue === a.totalRevenue) {
            return b.totalOrders - a.totalOrders;
        }
        return b.totalRevenue - a.totalRevenue;
    });
    if (limit) {
        const topCompanies = companiesArray.slice(0, limit);
        console.log("top customers Limited")
        return topCompanies
    }
    return companiesArray
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
    let Customer = await CustomerModel.find({ isDeleted: { $ne: true } }, {
        privacy: 0, password: 0, createdAt: 0, updatedAt: 0, sessionKey: 0, notification: 0, security: 0
    }).populate([{
        path: "selectedVehicle",
    }])
    // let updatedCustomers = [];
    // for (const customer of Customer) {
    //     let orders = await OrderModel.find({ customerId: customer?._id, status: "completed" }) // filter by Status 
    //     let totalSpents = 0
    //     orders?.forEach((order) => { totalSpents += parseFloat(order.cost) })

    //     console.log("totalSpents -------------------- ", totalSpents)


    // }
    return Customer
}

const getCustomerByid = async (req) => {
    let id = req.params.id
    let Customer = await CustomerModel.findOne({ _id: id }, {
        privacy: 0, password: 0, createdAt: 0, updatedAt: 0, sessionKey: 0, notification: 0, security: 0
    }).populate({
        path: "selectedVehicle",
    })
    let Bookings = await OrderModel.find({ customerId: id, isDeleted: { $ne: true } })
    console.log(Bookings)
    return { ...Customer?._doc, Bookings }
}

const deleteOrderByCustomerId = async (req) => {
    let { id } = req.params
    let date = new Date()
    let body = {
        isDeleted: true,
        deletedAt: date,
        deleteBy: {
            role: "admin",
            id: req.user.id
        }

    }
    let orders = await OrderModel.findOneAndUpdate({ _id: id }, { $set: { ...body } }, { new: true })
    return orders
}

const updateCustomer = async (req) => {
    let id = req.params.id
    let { location, numberPlate, phone, email } = req.body // email is sensitive
    let Customer = await CustomerModel.findByIdAndUpdate(id, { location, phone, }, { new: true, fields: { location: 1, phone: 1 } })
    let Vehicle = await VehiclesModel.findOneAndUpdate({ $and: [{ Owner: id }, { isSelected: true }] }, { vehiclePlateNumber: numberPlate, }, { new: true })

    return { Customer, Vehicle }
}


const terminateCustomer = async (req) => {
    let id = req.params.id
    let date = new Date()
    let body = {
        isTerminated: true,
        terminateBy: {
            id: req.user.id,
            role: "admin"
        },
        terminateAt: date,
    }
    let Customer = await CustomerModel.findByIdAndUpdate(id, { ...body }, {
        new: true, fields: {
            sessionKey: 0,
            notification: 0,
            privacy: 0,
            security: 0,
        }
    })
    return Customer
}


const terminateShop = async (req) => {
    let id = req.params.id
    let date = new Date()
    let body = {
        isTerminated: true,
        terminateBy: {
            id: req.user.id,
            role: "admin"
        },
        terminateAt: date,
    }
    let shop = await shopModel.findByIdAndUpdate(id, { ...body }, { new: true })
    return shop
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


const getVehiclesByCustomerId = async (req) => {
    let { customerId } = req.query
    let Vehicles = await VehiclesModel.find({ Owner: customerId })
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
        let FormatedRating = helper.formateReviewsRatings?.(Reviews)
        return FormatedRating
    }

    let Reviews = await reviewModel.find({ shopId: { $exists: true }, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = helper.formateReviewsRatings?.(Reviews)
    return FormatedRating
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
        let FormatedRating = helper.formateReviewsRatings?.(Reviews)
        return FormatedRating
    }

    let Reviews = await reviewModel.find({ sellerId: { $exists: true }, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = helper.formateReviewsRatings?.(Reviews)
    return FormatedRating
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
        let FormatedRating = helper.formateReviewsRatings?.(Reviews)
        return FormatedRating
    }

    let Reviews = await reviewModel.find({ orderId: { $exists: true }, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = helper.formateReviewsRatings?.(Reviews)
    return FormatedRating
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
        let FormatedRating = helper.formateReviewsRatings?.(Reviews)
        return FormatedRating
    }

    let Reviews = await reviewModel.find({ customerId: { $exists: true }, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = helper.formateReviewsRatings?.(Reviews)
    return FormatedRating
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

    let reply = await reviewModel.findOneAndUpdate({ _id: Review }, { $push: { reply: { ...body } } }, { new: true })
    if (!reply) return reply
    console.log(reply)
    let FormatedRating = helper.formateReviewsRatingsSingle?.(reply)
    return FormatedRating
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

    let reply = await reviewModel.findOneAndUpdate({ _id: Review }, { reply: myReply }, { new: true, fields: { comment: 1, shopId: 1, reply: 1, rating: 1 } })
    if (!reply) return reply
    let FormatedRating = helper.formateReviewsRatingsSingle?.(reply)
    return FormatedRating
}

const deleteMyReplys = async (req) => {
    let { reviewId, commentId } = req.query
    let Review = await reviewModel.findOne({ _id: reviewId });
    if (!Review) return null
    let myReply = Review.reply.find(reply => {
        if (reply.replyBy.id.toString() == req.user.id && commentId == reply.comment._id.toString()) {
            return reply._id
        }
    })
    if (!myReply) return myReply
    let reply = await reviewModel.findOneAndUpdate({ _id: Review }, { $pull: { reply: { _id: myReply._id } } }, { new: true, fields: { comment: 1, shopId: 1, reply: 1 } })
    return reply
}


const deleteReviews = async (req) => {
    let { reviewId } = req.query
    let Review = await reviewModel.findOneAndUpdate({ _id: reviewId }, { deleteBy: { id: req.user.id, role: 'admin' }, isDeleted: true }, { new: true });
    if (!Review) return Review
    let FormatedRating = helper.formateReviewsRatingsSingle?.(Review)
    return FormatedRating
}

// ----------------------------------------------- profile -----------------------------------------------------//

const updateImage = async (req, resizedAvatar, originalAvatar) => {
    let Admin = await AdminModel.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: { avatar: originalAvatar.Location, resizedAvatar: resizedAvatar.Location } },
        {
            new: true, fields: {
                avatar: 1,
                resizedAvatar: 1
            }
        }
    );
    return Admin;
};

// ----------------------------------------------- stats -----------------------------------------------------//

const getAllTimeStats = async (req) => {
    let { shopId } = req.query
    let newDate = new Date();
    let totalOrders = 0;
    let totalAmount = 0;
    let cancelledOrders = 0;
    let acceptedOrders = 0;

    const year = newDate.getFullYear();
    const daysInYear = helper.getDaysInYear(year);

    let currentMonth;
    let { monthData, monthNames } = helper.generateMonthOfYear();

    let filter = shopId ? ({ shopId }) : {}

    let orders = await OrderModel.find(filter)

    for (const singleOrder of orders) {
        // if (singleOrder.billingStatus != "paid") return
        let orderDate = singleOrder.createdAt ? new Date(singleOrder.createdAt) : new Date(singleOrder.date)
        currentMonth = monthNames[orderDate.getMonth()];
        if (singleOrder.status == "completed") {
            monthData[currentMonth].totalOrders++
            monthData[currentMonth].totalRevenue += parseFloat(singleOrder.cost);
            totalAmount += parseFloat(singleOrder.cost);
            totalOrders++
        }
        if (singleOrder.status == "cancelled") cancelledOrders++
        if (singleOrder.status == "inprocess") acceptedOrders++
        monthData[currentMonth].averageDailySales = parseFloat((monthData[currentMonth].totalRevenue / daysInYear[orderDate.getMonth()]).toFixed(2))
    }

    let response = {
        totalRevenue: totalAmount,
        averageMonthlySales: parseFloat((totalAmount / 12).toFixed(2)),
        totalOrders,
        acceptedOrders,
        cancelledOrders,
        graphData: Object.values(monthData),
    }
    return response
};

const getstatsbyMonth = async (req) => {
    let { startDate, shopId } = req.query

    let totalOrders = 0;
    let totalAmount = 0;
    let cancelledOrders = 0;
    let acceptedOrders = 0;

    let startOfmonth = startDate ? new Date(startDate) : new Date();
    startOfmonth.setDate(1);
    startOfmonth.setHours(0, 0, 0, 0);
    let endOfMonth = new Date(startOfmonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    let isShop = shopId ? { shopId } : {}
    let filter = {
        ...isShop,
        $or: [
            {
                'creacreatedAt': {
                    $gte: startOfmonth,
                    $lt: endOfMonth,
                }
            },
            {
                'date': {
                    $gte: startOfmonth,
                    $lt: endOfMonth,
                }
            },
        ]
    }

    console.log(filter)
    let year = startOfmonth.getFullYear()
    let month = startOfmonth.getMonth()
    let monthDays = helper.generateDaysOfMonth(year, month);
    let nameOfdays = [
        '01', '02', '03',
        '04', '05', '06', '07', '08',
        '09', '10', '11', '12', '13',
        '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23',
        '24', '25', '26', '27', '28',
        '29', '30', '31',
    ]
    let currentDay;
    console.log(filter)
    console.log(nameOfdays)
    let orders = await OrderModel.find(filter)

    for (const singleOrder of orders) {
        // if (singleOrder.billingStatus != "paid") return
        let orderDate = singleOrder.createdAt ? new Date(singleOrder.createdAt) : new Date(singleOrder.date)
        currentDay = nameOfdays[orderDate.getDate() - 1];
        if (singleOrder.status == "completed") {
            monthDays[currentDay].totalRevenue += parseFloat(singleOrder.cost);
            monthDays[currentDay].totalOrders++
            totalAmount += parseFloat(singleOrder.cost);
            totalOrders++
        }
        if (singleOrder.status == "cancelled") cancelledOrders++
        if (singleOrder.status == "inprocess") acceptedOrders++
    }

    let response = {
        totalRevenue: totalAmount,
        totalOrders,
        cancelledOrders,
        acceptedOrders,
        averageDailySales: parseFloat((totalAmount / nameOfdays.length).toFixed(2)),
        graphData: Object.values(monthDays)
    }
    return response
};

const getStatsByWeek = async (req) => {
    let { startDate } = req.query

    let totalOrders = 0;
    let totalAmount = 0;
    let cancelledOrders = 0;
    let acceptedOrders = 0;

    let startOfWeek = startDate ? new Date(startDate) : new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    let endOfMonth = new Date(startOfWeek);
    endOfMonth.setDate(startOfWeek.getDate() + 7)
    endOfMonth.setHours(0, 0, 0, 0);

    let filter = {
        $or: [
            {
                'creacreatedAt': {
                    $gte: startOfWeek,
                    $lt: endOfMonth,
                }
            },
            {
                'date': {
                    $gte: startOfWeek,
                    $lt: endOfMonth,
                }
            },
        ]
    }

    let { weekData, daysOfWeek } = helper.generateDaysOfWeek();
    let currentDay;
    console.log(filter)
    console.log(weekData, daysOfWeek)
    let orders = await OrderModel.find(filter)

    for (const singleOrder of orders) {
        // if (singleOrder.billingStatus != "paid") return
        let orderDate = singleOrder.createdAt ? new Date(singleOrder.createdAt) : new Date(singleOrder.date)
        currentDay = daysOfWeek[orderDate.getDay()];
        if (singleOrder.status == "completed") {
            weekData[currentDay].totalRevenue += parseFloat(singleOrder.cost);
            weekData[currentDay].totalOrders++
            totalAmount += parseFloat(singleOrder.cost);
            totalOrders++
        }
        if (singleOrder.status == "cancelled") cancelledOrders++
        if (singleOrder.status == "inprocess") acceptedOrders++
    }

    let response = {
        totalRevenue: totalAmount,
        totalOrders,
        cancelledOrders,
        acceptedOrders,
        averageDailySales: parseFloat((totalAmount / 7).toFixed(2)),
        graphData: Object.values(weekData)
    }
    return response
};


// ----------------------------------------------- sales -----------------------------------------------------//

const getShopForSales = async (req) => {
    let Shops = await shopModel.find().sort({ createdAt: 1, updatedAt: 1 })
    return Shops
};

const getSalesSingleShop = async (req) => {
    let { shopId, graph } = req.query

    let populate = [
        { path: "customerId", select: { username: 1, profile: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "vehicleId" },
    ]


    let shop = await shopModel.findOne({ _id: shopId }, { location: 0, __v: 0 })
    let orders = await OrderModel.find({ shopId }, { location: 0 }).populate(populate)
    let { graphData } = graph == "week" ? (await getStatsByWeek(req)) : graph == "month" ? (await getstatsbyMonth(req)) : (await getAllTimeStats(req))

    let response = {
        graphData,
        shop,
        orders
    }
    return response
};

module.exports = {
    getBusinessbyStatus,
    businessApprove,
    businessTerminate,
    JobHistory,
    getTopCustomer,
    getTopCompanies,
    getTopSellers,
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
    deleteMyReplys,
    deleteReviews,
    getSellerReviews,
    getOrderReviews,
    getCustomerReviews,
    getVehiclesByCustomerId,
    terminateCustomer,
    terminateShop,
    deleteOrderByCustomerId,
    updateImage,
    getAllTimeStats,
    getstatsbyMonth,
    getStatsByWeek,
    getSalesSingleShop,
    getShopForSales,
}